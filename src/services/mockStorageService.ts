// Mock Storage Service for Development (when Firebase Storage is not deployed)
// This provides the same interface as Firebase Storage but uses local storage

export interface MockUploadedFile {
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
  content?: string; // For text files in mock mode
}

export interface MockUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const STORAGE_KEY = 'mockStorage_files';
const STORAGE_CONTENT_KEY = 'mockStorage_content';

// Get all files from localStorage
const getAllFiles = (): MockUploadedFile[] => {
  try {
    const files = localStorage.getItem(STORAGE_KEY);
    return files ? JSON.parse(files) : [];
  } catch {
    return [];
  }
};

// Save all files to localStorage
const saveAllFiles = (files: MockUploadedFile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.warn('Failed to save files to localStorage:', error);
  }
};

// Get file content from localStorage
const getFileContent = (fileId: string): string | null => {
  try {
    const content = localStorage.getItem(`${STORAGE_CONTENT_KEY}_${fileId}`);
    return content;
  } catch {
    return null;
  }
};

// Save file content to localStorage
const saveFileContent = (fileId: string, content: string) => {
  try {
    localStorage.setItem(`${STORAGE_CONTENT_KEY}_${fileId}`, content);
  } catch (error) {
    console.warn('Failed to save file content:', error);
  }
};

// Read file content as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Check if file is a text file
const isTextFile = (fileName: string, fileType?: string): boolean => {
  const textExtensions = ['.txt', '.md', '.json', '.csv', '.xml', '.log', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.yml', '.yaml', '.toml', '.ini', '.conf', '.html', '.css', '.scss', '.less'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return textExtensions.includes(extension) || (fileType && fileType.startsWith('text/'));
};

export const mockUploadFile = async (
  file: File,
  projectId: string,
  userId: string,
  onProgress?: (progress: MockUploadProgress) => void
): Promise<MockUploadedFile> => {
  const fileId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate upload progress
  const progressSteps = [0, 25, 50, 75, 100];
  for (const progress of progressSteps) {
    onProgress?.({
      fileId,
      progress,
      status: progress === 100 ? 'completed' : 'uploading'
    });
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Create mock file URL (blob URL for real files)
  const url = URL.createObjectURL(file);
  
  const mockFile: MockUploadedFile = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date().toISOString(),
    url,
    downloadUrl: url,
    path: `mock/users/${userId}/projects/${projectId}/files/${fileId}_${file.name}`,
    projectId,
    userId
  };

  // If it's a text file, read and store its content
  if (isTextFile(file.name, file.type)) {
    try {
      const content = await readFileAsText(file);
      saveFileContent(fileId, content);
      mockFile.content = content;
    } catch (error) {
      console.warn('Failed to read text file content:', error);
    }
  }

  // Save to localStorage
  const allFiles = getAllFiles();
  allFiles.push(mockFile);
  saveAllFiles(allFiles);

  console.log('Mock file uploaded:', mockFile.name);
  return mockFile;
};

export const mockGetUserFiles = async (projectId: string, userId: string): Promise<MockUploadedFile[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allFiles = getAllFiles();
  const userProjectFiles = allFiles.filter(
    file => file.userId === userId && file.projectId === projectId
  );
  
  console.log(`Mock: Found ${userProjectFiles.length} files for user ${userId}, project ${projectId}`);
  return userProjectFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
};

export const mockDeleteFile = async (file: MockUploadedFile): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const allFiles = getAllFiles();
  const filteredFiles = allFiles.filter(f => f.id !== file.id);
  saveAllFiles(filteredFiles);
  
  // Clean up file content
  localStorage.removeItem(`${STORAGE_CONTENT_KEY}_${file.id}`);
  
  // Revoke blob URL to free memory
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url);
  }
  
  console.log('Mock file deleted:', file.name);
};

export const mockGetFileContent = async (file: MockUploadedFile): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  if (!isTextFile(file.name, file.type)) {
    throw new Error('File is not a text file');
  }

  const content = getFileContent(file.id);
  if (content === null) {
    throw new Error('File content not found');
  }

  // Sanitize content for security
  let sanitizedContent = content
    .replace(/<script[^>]*>.*?<\/script>/gis, '[SCRIPT REMOVED FOR SECURITY]')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '[IFRAME REMOVED FOR SECURITY]')
    .replace(/javascript:/gi, 'javascript-removed:')
    .replace(/data:text\/html/gi, 'data-html-removed:')
    .replace(/vbscript:/gi, 'vbscript-removed:');

  // Limit content length
  if (sanitizedContent.length > 50000) {
    sanitizedContent = sanitizedContent.substring(0, 50000) + '\n\n[Content truncated - file too large for full preview]';
  }

  return sanitizedContent;
};

export const mockDownloadFile = async (file: MockUploadedFile): Promise<void> => {
  // Create download link
  const link = document.createElement('a');
  link.href = file.downloadUrl;
  link.download = file.name;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('Mock file downloaded:', file.name);
};

// Check if we're in mock mode (Firebase Storage not available)
export const isMockMode = (): boolean => {
  // You can add more sophisticated detection here
  return localStorage.getItem('mockStorage_mode') === 'true' || true; // Default to mock for development
};

// Enable/disable mock mode
export const setMockMode = (enabled: boolean) => {
  localStorage.setItem('mockStorage_mode', enabled ? 'true' : 'false');
};

// Clear all mock data
export const clearMockStorage = () => {
  const allFiles = getAllFiles();
  
  // Revoke all blob URLs
  allFiles.forEach(file => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
    localStorage.removeItem(`${STORAGE_CONTENT_KEY}_${file.id}`);
  });
  
  localStorage.removeItem(STORAGE_KEY);
  console.log('Mock storage cleared');
};
