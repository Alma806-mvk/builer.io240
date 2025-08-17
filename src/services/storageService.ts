// Unified Storage Service - automatically switches between Firebase and Mock storage
// This service provides a consistent interface and handles fallbacks

import { auth } from '../config/firebase';
import {
  uploadFile as firebaseUploadFile,
  downloadFile as firebaseDownloadFile,
  deleteFile as firebaseDeleteFile,
  getFileContent as firebaseGetFileContent,
  getUserFiles as firebaseGetUserFiles,
  isTextFile as firebaseIsTextFile,
  UploadedFile as FirebaseUploadedFile,
  UploadProgress as FirebaseUploadProgress
} from './firebaseStorageService';

import {
  mockUploadFile,
  mockDownloadFile,
  mockDeleteFile,
  mockGetFileContent,
  mockGetUserFiles,
  isMockMode,
  MockUploadedFile,
  MockUploadProgress
} from './mockStorageService';

// Unified types (compatible with both Firebase and Mock)
export type UnifiedUploadedFile = FirebaseUploadedFile | MockUploadedFile;
export type UnifiedUploadProgress = FirebaseUploadProgress | MockUploadProgress;

export interface StorageServiceInterface {
  uploadFile: (file: File, projectId: string, onProgress?: (progress: UnifiedUploadProgress) => void) => Promise<UnifiedUploadedFile>;
  downloadFile: (file: UnifiedUploadedFile) => Promise<void>;
  deleteFile: (file: UnifiedUploadedFile) => Promise<void>;
  getFileContent: (file: UnifiedUploadedFile) => Promise<string>;
  getUserFiles: (projectId: string) => Promise<UnifiedUploadedFile[]>;
  isTextFile: (fileName: string, fileType?: string) => boolean;
}

// Check if Firebase Storage is available and working
const checkFirebaseStorageAvailable = async (): Promise<boolean> => {
  try {
    if (!auth.currentUser) {
      console.log('No authenticated user - using mock storage');
      return false;
    }

    // Try a simple Firebase Storage operation to test if it's working
    // We'll skip this for now and always use mock in development
    const forceFirebase = localStorage.getItem('forceFirebaseStorage') === 'true';
    if (forceFirebase) {
      console.log('Firebase Storage forced via localStorage');
      return true;
    }

    console.log('Using mock storage for development');
    return false;
  } catch (error) {
    console.log('Firebase Storage not available:', error);
    return false;
  }
};

class UnifiedStorageService implements StorageServiceInterface {
  private useFirebase = false;

  async init() {
    this.useFirebase = await checkFirebaseStorageAvailable();
    console.log(`Storage service initialized - Using: ${this.useFirebase ? 'Firebase' : 'Mock'} storage`);
  }

  async uploadFile(
    file: File, 
    projectId: string, 
    onProgress?: (progress: UnifiedUploadProgress) => void
  ): Promise<UnifiedUploadedFile> {
    if (!this.useFirebase) {
      // Use mock storage
      const userId = auth.currentUser?.uid || 'anonymous';
      return await mockUploadFile(file, projectId, userId, onProgress);
    } else {
      // Use Firebase storage
      return await firebaseUploadFile(file, projectId, onProgress);
    }
  }

  async downloadFile(file: UnifiedUploadedFile): Promise<void> {
    if (!this.useFirebase || file.path?.startsWith('mock/')) {
      return await mockDownloadFile(file as MockUploadedFile);
    } else {
      return await firebaseDownloadFile(file as FirebaseUploadedFile);
    }
  }

  async deleteFile(file: UnifiedUploadedFile): Promise<void> {
    if (!this.useFirebase || file.path?.startsWith('mock/')) {
      return await mockDeleteFile(file as MockUploadedFile);
    } else {
      return await firebaseDeleteFile(file as FirebaseUploadedFile);
    }
  }

  async getFileContent(file: UnifiedUploadedFile): Promise<string> {
    if (!this.useFirebase || file.path?.startsWith('mock/')) {
      return await mockGetFileContent(file as MockUploadedFile);
    } else {
      return await firebaseGetFileContent(file as FirebaseUploadedFile);
    }
  }

  async getUserFiles(projectId: string): Promise<UnifiedUploadedFile[]> {
    if (!this.useFirebase) {
      const userId = auth.currentUser?.uid || 'anonymous';
      return await mockGetUserFiles(projectId, userId);
    } else {
      return await firebaseGetUserFiles(projectId);
    }
  }

  isTextFile(fileName: string, fileType?: string): boolean {
    // This logic is the same for both Firebase and mock
    const textExtensions = ['.txt', '.md', '.json', '.csv', '.xml', '.log', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.yml', '.yaml', '.toml', '.ini', '.conf', '.html', '.css', '.scss', '.less'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return textExtensions.includes(extension) || (fileType && fileType.startsWith('text/'));
  }

  // Helper methods
  getCurrentMode(): 'firebase' | 'mock' {
    return this.useFirebase ? 'firebase' : 'mock';
  }

  async switchToFirebase() {
    localStorage.setItem('forceFirebaseStorage', 'true');
    this.useFirebase = true;
    console.log('Switched to Firebase storage');
  }

  switchToMock() {
    localStorage.removeItem('forceFirebaseStorage');
    this.useFirebase = false;
    console.log('Switched to mock storage');
  }
}

// Create singleton instance
export const storageService = new UnifiedStorageService();

// Initialize the service
storageService.init();

// Export individual functions that use the service
export const uploadFile = (file: File, projectId: string, onProgress?: (progress: UnifiedUploadProgress) => void) => 
  storageService.uploadFile(file, projectId, onProgress);

export const downloadFile = (file: UnifiedUploadedFile) => 
  storageService.downloadFile(file);

export const deleteFile = (file: UnifiedUploadedFile) => 
  storageService.deleteFile(file);

export const getFileContent = (file: UnifiedUploadedFile) => 
  storageService.getFileContent(file);

export const getUserFiles = (projectId: string) => 
  storageService.getUserFiles(projectId);

export const isTextFile = (fileName: string, fileType?: string) => 
  storageService.isTextFile(fileName, fileType);

// Export types
export type { UnifiedUploadedFile as UploadedFile, UnifiedUploadProgress as UploadProgress };
