import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject, 
  listAll,
  StorageReference,
  UploadResult,
  UploadTask,
  UploadTaskSnapshot
} from 'firebase/storage';
import { auth } from '../config/firebase';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface FileMetadata {
  name: string;
  fullPath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

class FileStorageService {
  private storage = getStorage();
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  /**
   * Get the authenticated user's storage reference
   */
  private getUserStorageRef(path: string = ''): StorageReference {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to access storage');
    }
    
    const userPath = `users/${user.uid}${path ? `/${path}` : ''}`;
    return ref(this.storage, userPath);
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (50MB)`);
    }

    const allowedTypes = [
      'image/', 'video/', 'audio/', 'text/', 
      'application/json', 'application/pdf',
      'application/zip', 'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.',
      'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint'
    ];

    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
      throw new Error(`File type '${file.type}' is not allowed`);
    }
  }

  /**
   * Upload a file to user's storage
   */
  async uploadFile(file: File, path: string): Promise<string> {
    this.validateFile(file);
    
    const fileRef = this.getUserStorageRef(path);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  /**
   * Upload file with progress tracking
   */
  uploadFileWithProgress(
    file: File, 
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    this.validateFile(file);
    
    const fileRef = this.getUserStorageRef(path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = {
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes
          };
          onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Delete a file from user's storage
   */
  async deleteFile(path: string): Promise<void> {
    const fileRef = this.getUserStorageRef(path);
    await deleteObject(fileRef);
  }

  /**
   * Get download URL for a file
   */
  async getFileURL(path: string): Promise<string> {
    const fileRef = this.getUserStorageRef(path);
    return await getDownloadURL(fileRef);
  }

  /**
   * List files in a user's folder
   */
  async listFiles(folderPath: string = ''): Promise<FileMetadata[]> {
    const folderRef = this.getUserStorageRef(folderPath);
    const result = await listAll(folderRef);
    
    const filePromises = result.items.map(async (itemRef) => {
      const downloadURL = await getDownloadURL(itemRef);
      const metadata = await itemRef.getMetadata();
      
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        downloadURL,
        size: metadata.size,
        contentType: metadata.contentType || 'unknown',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };
    });

    return await Promise.all(filePromises);
  }

  /**
   * Upload canvas export
   */
  async uploadCanvasExport(canvasData: any, filename?: string): Promise<string> {
    const timestamp = Date.now();
    const fileName = filename || `canvas-export-${timestamp}.json`;
    const blob = new Blob([JSON.stringify(canvasData, null, 2)], { 
      type: 'application/json' 
    });
    
    const file = new File([blob], fileName, { type: 'application/json' });
    return await this.uploadFile(file, `exports/${fileName}`);
  }

  /**
   * Upload generated image
   */
  async uploadGeneratedImage(imageBlob: Blob, type: 'thumbnail' | 'generated' | 'profile' = 'generated'): Promise<string> {
    const timestamp = Date.now();
    const extension = imageBlob.type.split('/')[1] || 'png';
    const fileName = `${type}-${timestamp}.${extension}`;
    
    const file = new File([imageBlob], fileName, { type: imageBlob.type });
    return await this.uploadFile(file, `${type}s/${fileName}`);
  }

  /**
   * Upload user content backup
   */
  async uploadBackup(data: any, type: 'history' | 'templates' | 'settings' = 'history'): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${type}-backup-${timestamp}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const file = new File([blob], fileName, { type: 'application/json' });
    return await this.uploadFile(file, `backups/${fileName}`);
  }

  /**
   * Clean up old files (helper for maintenance)
   */
  async cleanupOldFiles(folderPath: string, maxAge: number = 30): Promise<number> {
    const files = await this.listFiles(folderPath);
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const file of files) {
      const fileDate = new Date(file.timeCreated);
      if (fileDate < cutoffDate) {
        try {
          // Extract path relative to user folder
          const relativePath = file.fullPath.split('/').slice(2).join('/');
          await this.deleteFile(relativePath);
          deletedCount++;
        } catch (error) {
          console.warn(`Failed to delete old file ${file.fullPath}:`, error);
        }
      }
    }

    return deletedCount;
  }

  /**
   * Get storage usage for current user
   */
  async getStorageUsage(): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const files = await this.listFiles();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      return {
        totalSize,
        fileCount: files.length
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
  }
}

export const fileStorageService = new FileStorageService();
export default fileStorageService;
