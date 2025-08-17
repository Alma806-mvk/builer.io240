import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CanvasItem } from '../types';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  color: string; // Unique color for each user
  lastSeen: Timestamp;
  isActive: boolean;
}

export interface CollaborationProject {
  id: string;
  name: string;
  ownerId: string;
  collaborators: string[]; // Array of user IDs
  canvasItems: CanvasItem[];
  lastModified: Timestamp;
  createdAt: Timestamp;
}

export interface CollaborationEvent {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  action: 'item_added' | 'item_updated' | 'item_deleted' | 'cursor_moved';
  data: any;
  timestamp: Timestamp;
}

class CanvasCollaborationService {
  private unsubscribeCallbacks: Map<string, () => void> = new Map();
  private currentUserId: string | null = null;
  private currentProjectId: string | null = null;

  // User colors for collaboration
  private readonly USER_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  /**
   * Initialize collaboration for a project
   */
  async initializeCollaboration(
    projectId: string, 
    userId: string, 
    userName: string, 
    userEmail: string
  ): Promise<void> {
    this.currentUserId = userId;
    this.currentProjectId = projectId;

    // Add user to project presence
    await this.updateUserPresence(projectId, userId, userName, userEmail, true);

    // Set up presence cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Update user presence in the project
   */
  async updateUserPresence(
    projectId: string,
    userId: string,
    userName: string,
    userEmail: string,
    isActive: boolean,
    cursor?: { x: number; y: number }
  ): Promise<void> {
    const userRef = doc(db, `collaborationProjects/${projectId}/presence/${userId}`);
    
    const userData: Partial<CollaborationUser> = {
      id: userId,
      name: userName,
      email: userEmail,
      color: this.getUserColor(userId),
      lastSeen: serverTimestamp() as Timestamp,
      isActive,
    };

    if (cursor) {
      userData.cursor = cursor;
    }

    await setDoc(userRef, userData, { merge: true });
  }

  /**
   * Update user cursor position in real-time
   */
  async updateCursorPosition(
    projectId: string,
    userId: string,
    cursor: { x: number; y: number }
  ): Promise<void> {
    if (!this.currentUserId || this.currentUserId !== userId) return;

    const userRef = doc(db, `collaborationProjects/${projectId}/presence/${userId}`);
    await updateDoc(userRef, {
      cursor,
      lastSeen: serverTimestamp()
    });
  }

  /**
   * Subscribe to live user presence updates
   */
  subscribeToPresence(
    projectId: string,
    callback: (users: CollaborationUser[]) => void
  ): () => void {
    const presenceRef = collection(db, `collaborationProjects/${projectId}/presence`);
    
    const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
      const users: CollaborationUser[] = [];
      snapshot.forEach((doc) => {
        const userData = doc.data() as CollaborationUser;
        // Only show users active in the last 30 seconds
        const thirtySecondsAgo = new Date(Date.now() - 30000);
        if (userData.isActive && userData.lastSeen.toDate() > thirtySecondsAgo) {
          users.push(userData);
        }
      });
      callback(users);
    });

    this.unsubscribeCallbacks.set(`presence_${projectId}`, unsubscribe);
    return unsubscribe;
  }

  /**
   * Update canvas items in real-time
   */
  async updateCanvasItem(
    projectId: string,
    itemId: string,
    updates: Partial<CanvasItem>,
    userId: string
  ): Promise<void> {
    const itemRef = doc(db, `collaborationProjects/${projectId}/canvasItems/${itemId}`);
    
    await setDoc(itemRef, {
      ...updates,
      lastModified: serverTimestamp(),
      lastModifiedBy: userId
    }, { merge: true });

    // Log the event
    await this.logCollaborationEvent(projectId, userId, 'item_updated', {
      itemId,
      updates
    });
  }

  /**
   * Add new canvas item
   */
  async addCanvasItem(
    projectId: string,
    item: CanvasItem,
    userId: string
  ): Promise<void> {
    const itemRef = doc(db, `collaborationProjects/${projectId}/canvasItems/${item.id}`);
    
    await setDoc(itemRef, {
      ...item,
      createdAt: serverTimestamp(),
      createdBy: userId,
      lastModified: serverTimestamp(),
      lastModifiedBy: userId
    });

    // Log the event
    await this.logCollaborationEvent(projectId, userId, 'item_added', {
      itemId: item.id,
      item
    });
  }

  /**
   * Delete canvas item
   */
  async deleteCanvasItem(
    projectId: string,
    itemId: string,
    userId: string
  ): Promise<void> {
    const itemRef = doc(db, `collaborationProjects/${projectId}/canvasItems/${itemId}`);
    await deleteDoc(itemRef);

    // Log the event
    await this.logCollaborationEvent(projectId, userId, 'item_deleted', {
      itemId
    });
  }

  /**
   * Subscribe to canvas items changes
   */
  subscribeToCanvasItems(
    projectId: string,
    callback: (items: CanvasItem[]) => void
  ): () => void {
    const itemsRef = collection(db, `collaborationProjects/${projectId}/canvasItems`);
    
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const items: CanvasItem[] = [];
      snapshot.forEach((doc) => {
        const itemData = doc.data() as CanvasItem;
        items.push(itemData);
      });
      callback(items);
    });

    this.unsubscribeCallbacks.set(`canvasItems_${projectId}`, unsubscribe);
    return unsubscribe;
  }

  /**
   * Subscribe to collaboration events (activity feed)
   */
  subscribeToEvents(
    projectId: string,
    callback: (events: CollaborationEvent[]) => void,
    limit: number = 50
  ): () => void {
    const eventsRef = collection(db, `collaborationProjects/${projectId}/events`);
    const eventsQuery = query(
      eventsRef,
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const events: CollaborationEvent[] = [];
      snapshot.forEach((doc) => {
        const eventData = doc.data() as CollaborationEvent;
        events.push(eventData);
      });
      callback(events.slice(0, limit));
    });

    this.unsubscribeCallbacks.set(`events_${projectId}`, unsubscribe);
    return unsubscribe;
  }

  /**
   * Create or update collaboration project
   */
  async createCollaborationProject(
    projectId: string,
    projectName: string,
    ownerId: string,
    initialItems: CanvasItem[] = []
  ): Promise<void> {
    const projectRef = doc(db, `collaborationProjects/${projectId}`);
    
    await setDoc(projectRef, {
      id: projectId,
      name: projectName,
      ownerId,
      collaborators: [ownerId],
      lastModified: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    // Add initial canvas items
    for (const item of initialItems) {
      await this.addCanvasItem(projectId, item, ownerId);
    }
  }

  /**
   * Add collaborator to project
   */
  async addCollaborator(
    projectId: string,
    collaboratorEmail: string,
    ownerId: string
  ): Promise<void> {
    const projectRef = doc(db, `collaborationProjects/${projectId}`);
    
    // In a real implementation, you'd look up user by email
    // For now, we'll just add the email to a pending invitations collection
    const inviteRef = doc(db, `collaborationProjects/${projectId}/invitations/${collaboratorEmail}`);
    await setDoc(inviteRef, {
      email: collaboratorEmail,
      invitedBy: ownerId,
      invitedAt: serverTimestamp(),
      status: 'pending'
    });
  }

  /**
   * Generate unique color for user
   */
  private getUserColor(userId: string): string {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.USER_COLORS[hash % this.USER_COLORS.length];
  }

  /**
   * Log collaboration event
   */
  private async logCollaborationEvent(
    projectId: string,
    userId: string,
    action: CollaborationEvent['action'],
    data: any
  ): Promise<void> {
    const eventRef = doc(collection(db, `collaborationProjects/${projectId}/events`));
    
    await setDoc(eventRef, {
      id: eventRef.id,
      projectId,
      userId,
      userName: 'User', // In real implementation, get from user context
      action,
      data,
      timestamp: serverTimestamp()
    });
  }

  /**
   * Cleanup when leaving collaboration
   */
  async cleanup(): Promise<void> {
    if (this.currentProjectId && this.currentUserId) {
      // Mark user as inactive
      const userRef = doc(db, `collaborationProjects/${this.currentProjectId}/presence/${this.currentUserId}`);
      await updateDoc(userRef, {
        isActive: false,
        lastSeen: serverTimestamp()
      });
    }

    // Unsubscribe from all listeners
    this.unsubscribeCallbacks.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.unsubscribeCallbacks.clear();

    this.currentUserId = null;
    this.currentProjectId = null;
  }

  /**
   * Check if user has collaboration access (Agency Pro feature)
   */
  hasCollaborationAccess(userPlan: string): boolean {
    return userPlan === 'agency pro' || userPlan === 'enterprise';
  }
}

export const canvasCollaborationService = new CanvasCollaborationService();
export default canvasCollaborationService;
