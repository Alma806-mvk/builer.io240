import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { canvasCollaborationService, CollaborationUser } from '../../services/canvasCollaborationService';
import { CanvasItem } from '../../types';
import CanvasCollaboration from './CanvasCollaboration';
import LiveCursors from './LiveCursors';

interface CanvasCollaborationIntegrationProps {
  canvasItems: CanvasItem[];
  onCanvasItemsChange: (items: CanvasItem[]) => void;
  onUpdateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  onAddCanvasItem: (item: CanvasItem) => void;
  onDeleteCanvasItem: (id: string) => void;
  children: React.ReactNode;
  projectId?: string;
  projectName?: string;
}

export const CanvasCollaborationIntegration: React.FC<CanvasCollaborationIntegrationProps> = ({
  canvasItems,
  onCanvasItemsChange,
  onUpdateCanvasItem,
  onAddCanvasItem,
  onDeleteCanvasItem,
  children,
  projectId = 'default-project',
  projectName = 'Untitled Project'
}) => {
  const { user } = useAuth();
  const { billingInfo } = useSubscription();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [isCollaborationEnabled, setIsCollaborationEnabled] = useState(false);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if user has collaboration access
  const hasCollaborationAccess = canvasCollaborationService.hasCollaborationAccess(
    billingInfo?.subscription?.planId || 'free'
  );

  // Handle mouse movement for cursor tracking
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!hasCollaborationAccess || !user || !isCollaborationEnabled || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const cursor = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Throttle cursor updates to avoid too many Firebase writes
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }

    mouseMoveTimeoutRef.current = setTimeout(() => {
      canvasCollaborationService.updateCursorPosition(projectId, user.uid, cursor);
    }, 50); // Update cursor position every 50ms max
  }, [hasCollaborationAccess, user, isCollaborationEnabled, projectId]);

  // Handle collaborative canvas item updates
  const handleCollaborativeItemUpdate = useCallback((id: string, updates: Partial<CanvasItem>) => {
    if (!hasCollaborationAccess || !user || !isCollaborationEnabled) {
      // Fallback to local update
      onUpdateCanvasItem(id, updates);
      return;
    }

    // Update through collaboration service for real-time sync
    canvasCollaborationService.updateCanvasItem(projectId, id, updates, user.uid);
  }, [hasCollaborationAccess, user, isCollaborationEnabled, projectId, onUpdateCanvasItem]);

  // Handle collaborative canvas item addition
  const handleCollaborativeItemAdd = useCallback((item: CanvasItem) => {
    if (!hasCollaborationAccess || !user || !isCollaborationEnabled) {
      // Fallback to local add
      onAddCanvasItem(item);
      return;
    }

    // Add through collaboration service for real-time sync
    canvasCollaborationService.addCanvasItem(projectId, item, user.uid);
  }, [hasCollaborationAccess, user, isCollaborationEnabled, projectId, onAddCanvasItem]);

  // Handle collaborative canvas item deletion
  const handleCollaborativeItemDelete = useCallback((id: string) => {
    if (!hasCollaborationAccess || !user || !isCollaborationEnabled) {
      // Fallback to local delete
      onDeleteCanvasItem(id);
      return;
    }

    // Delete through collaboration service for real-time sync
    canvasCollaborationService.deleteCanvasItem(projectId, id, user.uid);
  }, [hasCollaborationAccess, user, isCollaborationEnabled, projectId, onDeleteCanvasItem]);

  // Handle collaborators change
  const handleCollaboratorsChange = useCallback((users: CollaborationUser[]) => {
    setCollaborators(users);
    setIsCollaborationEnabled(users.length > 1); // Enable collaboration when multiple users
  }, []);

  // Handle canvas items change from collaboration
  const handleCanvasItemsChange = useCallback((items: CanvasItem[]) => {
    // Only update if items are different to avoid infinite loops
    const currentItemIds = new Set(canvasItems.map(item => item.id));
    const newItemIds = new Set(items.map(item => item.id));
    
    const hasChanges = 
      currentItemIds.size !== newItemIds.size ||
      [...currentItemIds].some(id => !newItemIds.has(id)) ||
      items.some(item => {
        const currentItem = canvasItems.find(ci => ci.id === item.id);
        return !currentItem || JSON.stringify(currentItem) !== JSON.stringify(item);
      });

    if (hasChanges) {
      onCanvasItemsChange(items);
    }
  }, [canvasItems, onCanvasItemsChange]);

  // Initialize collaboration project
  useEffect(() => {
    if (!hasCollaborationAccess || !user) return;

    const initProject = async () => {
      try {
        await canvasCollaborationService.createCollaborationProject(
          projectId,
          projectName,
          user.uid,
          canvasItems
        );
      } catch (error) {
        console.error('Failed to initialize collaboration project:', error);
      }
    };

    initProject();
  }, [hasCollaborationAccess, user, projectId, projectName]);

  // Enhanced event handlers for collaboration
  const enhancedHandlers = React.useMemo(() => ({
    onUpdateCanvasItem: handleCollaborativeItemUpdate,
    onAddCanvasItem: handleCollaborativeItemAdd,
    onDeleteCanvasItem: handleCollaborativeItemDelete
  }), [handleCollaborativeItemUpdate, handleCollaborativeItemAdd, handleCollaborativeItemDelete]);

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
    >
      {/* Original Canvas Content */}
      {React.cloneElement(children as React.ReactElement, enhancedHandlers)}

      {/* Live Cursors Overlay */}
      {hasCollaborationAccess && isCollaborationEnabled && (
        <LiveCursors
          collaborators={collaborators}
          currentUserId={user?.uid}
          containerRef={canvasRef}
        />
      )}

      {/* Collaboration Panel */}
      {hasCollaborationAccess && (
        <CanvasCollaboration
          projectId={projectId}
          projectName={projectName}
          onCollaboratorsChange={handleCollaboratorsChange}
          onCanvasItemsChange={handleCanvasItemsChange}
        />
      )}

      {/* Collaboration Status Indicator */}
      {isCollaborationEnabled && (
        <div className="fixed top-20 left-4 bg-green-600/90 backdrop-blur-xl border border-green-500/50 rounded-lg px-3 py-2 shadow-lg z-40">
          <div className="flex items-center gap-2 text-white text-sm">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span>Live Collaboration Active</span>
            <span className="text-green-200">({collaborators.length} users)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasCollaborationIntegration;
