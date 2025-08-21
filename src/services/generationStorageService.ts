import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db, auth, safeFirestoreOperation } from '../config/firebase';
import { ContentType, Platform, Language, AiPersona } from '../types';

export interface GenerationRecord {
  id: string;
  userId: string;
  timestamp: Timestamp;
  
  // Input configuration
  prompt: string;
  platform: Platform;
  contentType: ContentType;
  targetAudience?: string;
  batchVariations?: number;
  
  // Advanced settings
  aiPersona?: AiPersona;
  aiPersonaId?: string;
  targetLanguage?: Language;
  videoLength?: string;
  customVideoLength?: string;
  
  // SEO settings (if applicable)
  seoKeywords?: string;
  seoMode?: string;
  seoIntensity?: string;
  
  // Image settings (if applicable)
  aspectRatioGuidance?: string;
  selectedImageStyles?: string[];
  selectedImageMoods?: string[];
  negativeImagePrompt?: string;
  
  // Generated content storage
  storageUrls: {
    textContent?: string;
    imageContent?: string;
    thumbnailContent?: string;
  };
  storagePaths: {
    textContent?: string;
    imageContent?: string;
    thumbnailContent?: string;
  };
  
  // Generation metadata
  generationDuration?: number; // milliseconds
  outputSize?: number; // bytes
  model?: string; // AI model used
  
  // User feedback
  userFeedback?: {
    rating: -1 | 0 | 1; // -1 = negative, 0 = neutral/no rating, 1 = positive
    timestamp: Timestamp;
    comment?: string;
  };
  
  // Usage tracking
  timesAccessed?: number;
  lastAccessed?: Timestamp;
  exportedFormats?: string[]; // ['markdown', 'pdf', 'txt', etc.]
  sentToCanvas?: boolean;
  
  // Organization
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
}

export class GenerationStorageService {
  private static instance: GenerationStorageService;
  private readonly collectionName = 'generations';

  static getInstance(): GenerationStorageService {
    if (!GenerationStorageService.instance) {
      GenerationStorageService.instance = new GenerationStorageService();
    }
    return GenerationStorageService.instance;
  }

  /**
   * Save a new generation record to Firestore
   */
  async saveGeneration(record: Omit<GenerationRecord, 'id' | 'userId' | 'timestamp'>, providedGenerationId?: string): Promise<string> {
    const userId = this.getCurrentUserId();
    const generationId = providedGenerationId || `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('🔍 Generation Storage Debug:', {
      userId,
      generationId,
      collectionName: this.collectionName,
      hasRecord: !!record,
      recordKeys: Object.keys(record)
    });

    const generationRecord: GenerationRecord = {
      id: generationId,
      userId,
      timestamp: Timestamp.now(),
      timesAccessed: 0,
      ...record
    };

    console.log('📋 Final generation record structure:', {
      id: generationRecord.id,
      userId: generationRecord.userId,
      prompt: generationRecord.prompt?.substring(0, 50) + '...',
      contentType: generationRecord.contentType,
      platform: generationRecord.platform
    });

    return safeFirestoreOperation(
      async () => {
        console.log('🏪 Attempting Firestore write to collection:', this.collectionName);
        const docRef = doc(db, this.collectionName, generationId);
        await setDoc(docRef, generationRecord);
        console.log('✅ Generation saved to Firestore successfully:', generationId);
        return generationId;
      },
      generationId,
      'Save generation record'
    );
  }

  /**
   * Get a specific generation record
   */
  async getGeneration(generationId: string): Promise<GenerationRecord | null> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const docRef = doc(db, this.collectionName, generationId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as GenerationRecord;
          
          // Verify user owns this generation
          if (data.userId !== userId) {
            throw new Error('Access denied: You do not own this generation');
          }
          
          // Update access tracking
          await this.updateAccessTracking(generationId);
          
          return data;
        }
        return null;
      },
      null,
      'Get generation record'
    );
  }

  /**
   * Get all generations for the current user
   */
  async getUserGenerations(
    limitCount: number = 50,
    includeArchived: boolean = false
  ): Promise<GenerationRecord[]> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        let queryRef = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );

        if (!includeArchived) {
          queryRef = query(
            collection(db, this.collectionName),
            where('userId', '==', userId),
            where('isArchived', '!=', true),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
          );
        }

        const querySnapshot = await getDocs(queryRef);
        return querySnapshot.docs.map(doc => doc.data() as GenerationRecord);
      },
      [],
      'Get user generations'
    );
  }

  /**
   * Update user feedback for a generation
   */
  async updateFeedback(
    generationId: string,
    feedback: {
      rating: -1 | 0 | 1; // -1 = negative, 0 = neutral/no rating, 1 = positive
      comment?: string;
    }
  ): Promise<void> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const docRef = doc(db, this.collectionName, generationId);
        
        // First verify the user owns this generation
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Generation not found');
        }
        
        const data = docSnap.data() as GenerationRecord;
        if (data.userId !== userId) {
          throw new Error('Access denied: You do not own this generation');
        }

        // Update feedback
        await updateDoc(docRef, {
          userFeedback: {
            rating: feedback.rating,
            timestamp: Timestamp.now(),
            comment: feedback.comment || null
          }
        });
        
        console.log('✅ Feedback updated for generation:', generationId);
      },
      undefined,
      'Update generation feedback'
    );
  }

  /**
   * Update generation metadata (for tracking usage, exports, etc.)
   */
  async updateGenerationMetadata(
    generationId: string,
    updates: Partial<Pick<GenerationRecord, 'sentToCanvas' | 'exportedFormats' | 'isFavorite' | 'isArchived' | 'tags'>>
  ): Promise<void> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const docRef = doc(db, this.collectionName, generationId);
        
        // Verify ownership
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Generation not found');
        }
        
        const data = docSnap.data() as GenerationRecord;
        if (data.userId !== userId) {
          throw new Error('Access denied');
        }

        await updateDoc(docRef, updates);
        console.log('✅ Generation metadata updated:', generationId);
      },
      undefined,
      'Update generation metadata'
    );
  }

  /**
   * Delete a generation record and its associated files
   */
  async deleteGeneration(generationId: string): Promise<void> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const docRef = doc(db, this.collectionName, generationId);
        
        // Get the record first to verify ownership and get file paths
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Generation not found');
        }
        
        const data = docSnap.data() as GenerationRecord;
        if (data.userId !== userId) {
          throw new Error('Access denied');
        }

        // Delete the Firestore document
        await deleteDoc(docRef);
        
        console.log('✅ Generation deleted from Firestore:', generationId);
        
        // Note: File deletion from Storage should be handled separately
        // to avoid orphaned records if storage deletion fails
        return data.storagePaths;
      },
      undefined,
      'Delete generation record'
    );
  }

  /**
   * Get generations by content type
   */
  async getGenerationsByContentType(
    contentType: ContentType,
    limitCount: number = 20
  ): Promise<GenerationRecord[]> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const queryRef = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('contentType', '==', contentType),
          where('isArchived', '!=', true),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );

        const querySnapshot = await getDocs(queryRef);
        return querySnapshot.docs.map(doc => doc.data() as GenerationRecord);
      },
      [],
      'Get generations by content type'
    );
  }

  /**
   * Get user's favorite generations
   */
  async getFavoriteGenerations(limitCount: number = 20): Promise<GenerationRecord[]> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        const queryRef = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('isFavorite', '==', true),
          where('isArchived', '!=', true),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );

        const querySnapshot = await getDocs(queryRef);
        return querySnapshot.docs.map(doc => doc.data() as GenerationRecord);
      },
      [],
      'Get favorite generations'
    );
  }

  /**
   * Search generations by prompt content
   */
  async searchGenerations(searchTerm: string, limitCount: number = 20): Promise<GenerationRecord[]> {
    const userId = this.getCurrentUserId();
    
    return safeFirestoreOperation(
      async () => {
        // Note: Firestore doesn't support full-text search natively
        // This is a basic implementation that can be enhanced with Algolia or similar
        const queryRef = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('isArchived', '!=', true),
          orderBy('timestamp', 'desc'),
          limit(limitCount * 2) // Get more to filter client-side
        );

        const querySnapshot = await getDocs(queryRef);
        const allGenerations = querySnapshot.docs.map(doc => doc.data() as GenerationRecord);
        
        // Client-side filtering (can be replaced with proper search service)
        const searchTermLower = searchTerm.toLowerCase();
        return allGenerations
          .filter(gen => 
            gen.prompt.toLowerCase().includes(searchTermLower) ||
            gen.targetAudience?.toLowerCase().includes(searchTermLower) ||
            gen.tags?.some(tag => tag.toLowerCase().includes(searchTermLower))
          )
          .slice(0, limitCount);
      },
      [],
      'Search generations'
    );
  }

  /**
   * Update access tracking for analytics
   */
  private async updateAccessTracking(generationId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, generationId);
      await updateDoc(docRef, {
        timesAccessed: (await getDoc(docRef)).data()?.timesAccessed + 1 || 1,
        lastAccessed: Timestamp.now()
      });
    } catch (error) {
      // Don't throw errors for tracking updates
      console.warn('Could not update access tracking:', error);
    }
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to access generations');
    }
    return currentUser.uid;
  }
}

export const generationStorageService = GenerationStorageService.getInstance();
