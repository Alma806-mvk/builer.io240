import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  StorageReference 
} from 'firebase/storage';
import { storage, auth } from '../config/firebase';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export class FirebaseStorageService {
  private static instance: FirebaseStorageService;

  static getInstance(): FirebaseStorageService {
    if (!FirebaseStorageService.instance) {
      FirebaseStorageService.instance = new FirebaseStorageService();
    }
    return FirebaseStorageService.instance;
  }

  /**
   * Upload generated text content to Firebase Storage
   */
  async uploadTextContent(content: string, metadata: {
    userId: string;
    contentType: string;
    generationId: string;
  }): Promise<UploadResult> {
    try {
      // Create a text blob
      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
      
      // Create storage path
      const path = `generated-content/${metadata.userId}/${metadata.contentType}/${metadata.generationId}.txt`;
      const storageRef = ref(storage, path);

      // Upload with metadata
      const uploadMetadata = {
        contentType: 'text/plain',
        customMetadata: {
          userId: metadata.userId,
          contentType: metadata.contentType,
          generationId: metadata.generationId,
          createdAt: new Date().toISOString()
        }
      };

      const snapshot = await uploadBytes(storageRef, blob, uploadMetadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: path,
        size: snapshot.metadata.size || blob.size,
        contentType: 'text/plain'
      };
    } catch (error) {
      console.error('Error uploading text content:', error);
      throw new Error(`Failed to upload text content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload generated image to Firebase Storage
   */
  async uploadImageContent(
    imageData: string | Blob, 
    metadata: {
      userId: string;
      contentType: string;
      generationId: string;
      mimeType?: string;
    }
  ): Promise<UploadResult> {
    try {
      let blob: Blob;
      let contentType = metadata.mimeType || 'image/png';

      if (typeof imageData === 'string') {
        // Handle base64 data
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: contentType });
      } else {
        blob = imageData;
        contentType = imageData.type;
      }

      // Create storage path
      const extension = contentType.split('/')[1] || 'png';
      const path = `generated-images/${metadata.userId}/${metadata.contentType}/${metadata.generationId}.${extension}`;
      const storageRef = ref(storage, path);

      // Upload with metadata
      const uploadMetadata = {
        contentType: contentType,
        customMetadata: {
          userId: metadata.userId,
          contentType: metadata.contentType,
          generationId: metadata.generationId,
          createdAt: new Date().toISOString()
        }
      };

      const snapshot = await uploadBytes(storageRef, blob, uploadMetadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: path,
        size: snapshot.metadata.size || blob.size,
        contentType: contentType
      };
    } catch (error) {
      console.error('Error uploading image content:', error);
      throw new Error(`Failed to upload image content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current user ID (required for all operations)
   */
  private getCurrentUserId(): string {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to access storage');
    }
    return currentUser.uid;
  }

  /**
   * Helper method to upload any generated content based on type
   */
  async uploadGeneratedContent(
    content: any,
    metadata: {
      contentType: string;
      generationId: string;
      outputType: 'text' | 'image';
    }
  ): Promise<UploadResult> {
    const userId = this.getCurrentUserId();
    
    if (metadata.outputType === 'text') {
      return this.uploadTextContent(content, {
        userId,
        contentType: metadata.contentType,
        generationId: metadata.generationId
      });
    } else if (metadata.outputType === 'image') {
      return this.uploadImageContent(content, {
        userId,
        contentType: metadata.contentType,
        generationId: metadata.generationId
      });
    } else {
      throw new Error(`Unsupported output type: ${metadata.outputType}`);
    }
  }
}

export const firebaseStorageService = FirebaseStorageService.getInstance();

// For compatibility with existing storage service interface
export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: string;
  url: string;
  downloadUrl: string;
  path: string;
  projectId: string;
  userId: string;
};

export type UploadProgress = {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
};

// Export standalone functions for compatibility with existing storageService.ts
export const uploadFile = async (
  file: File,
  projectId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedFile> => {
  // This would need to be implemented to upload actual File objects
  // For now, throw an error since our service is designed for generated content
  throw new Error('uploadFile for File objects not implemented in firebaseStorageService - use firebaseIntegratedGenerationService instead');
};

export const deleteFile = async (file: UploadedFile): Promise<void> => {
  return firebaseStorageService.deleteFile(file.path);
};

export const downloadFile = async (file: UploadedFile): Promise<void> => {
  // Download the file by opening the URL
  const link = document.createElement('a');
  link.href = file.downloadUrl || file.url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFileContent = async (file: UploadedFile): Promise<string> => {
  // This would need to be implemented to fetch file content from Firebase Storage
  throw new Error('getFileContent not implemented in firebaseStorageService');
};

export const getUserFiles = async (projectId: string): Promise<UploadedFile[]> => {
  // This would need to be implemented to list user files from Firebase Storage
  return [];
};

export const isTextFile = (fileName: string, fileType?: string): boolean => {
  const textExtensions = ['.txt', '.md', '.json', '.csv', '.xml', '.log', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.yml', '.yaml', '.toml', '.ini', '.conf', '.html', '.css', '.scss', '.less'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return textExtensions.includes(extension) || (fileType && fileType.startsWith('text/'));
};
