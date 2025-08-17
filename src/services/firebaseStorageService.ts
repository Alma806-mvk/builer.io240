import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  getMetadata,
  listAll 
} from 'firebase/storage';
import { storage, auth } from '../config/firebase';

export interface UploadedFile {
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
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Security: File validation functions
const ALLOWED_FILE_TYPES = {
  text: ['.txt', '.md', '.json', '.csv', '.xml', '.log', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.sh', '.bat', '.yml', '.yaml', '.toml', '.ini', '.conf', '.html', '.css', '.scss', '.less'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.rtf'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz'],
  media: ['.mp4', '.avi', '.mov', '.wmv', '.mp3', '.wav', '.aac', '.ogg']
};

const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh',
  '.msi', '.msp', '.dll', '.app', '.deb', '.dmg', '.pkg', '.run', '.sh', '.ps1', '.psm1',
  '.jar', '.class', '.war', '.ear', '.apk', '.ipa', '.crx', '.xpi'
];

const validateFile = (file: File): { valid: boolean; error?: string } => {
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  // Check blocked extensions
  if (BLOCKED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: `Executable files (${extension}) are not allowed for security reasons.` };
  }
  
  // Check if extension is in allowed list
  const isAllowed = Object.values(ALLOWED_FILE_TYPES).flat().includes(extension);
  if (!isAllowed && extension) {
    return { valid: false, error: `File type ${extension} is not supported.` };
  }
  
  // Check file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    return { valid: false, error: 'File size cannot exceed 100MB.' };
  }
  
  return { valid: true };
};

export const uploadFile = async (
  file: File,
  projectId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedFile> => {
  // Check if user is authenticated
  if (!auth.currentUser) {
    console.warn('No authenticated user found for upload');
    throw new Error('User must be authenticated to upload files');
  }

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const userId = auth.currentUser.uid;
  const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Create storage path: users/{userId}/projects/{projectId}/files/{fileId}_{fileName}
  const filePath = `users/${userId}/projects/${projectId}/files/${fileId}_${sanitizedFileName}`;
  const storageRef = ref(storage, filePath);

  console.log('Uploading file:', file.name, 'to path:', filePath, 'for user:', userId);

  try {
    // Report initial progress
    onProgress?.({
      fileId,
      progress: 0,
      status: 'uploading'
    });

    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot.ref.fullPath);

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadUrl);

    // Report completion
    onProgress?.({
      fileId,
      progress: 100,
      status: 'completed'
    });

    // Return file metadata
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date().toISOString(),
      url: downloadUrl,
      downloadUrl,
      path: filePath,
      projectId,
      userId
    };

    return uploadedFile;
  } catch (error: any) {
    console.error('Upload error:', error);

    let errorMessage = error.message;
    if (error.code === 'storage/unauthorized') {
      errorMessage = 'Upload failed: Access denied. Please check your permissions.';
    }

    onProgress?.({
      fileId,
      progress: 0,
      status: 'error',
      error: errorMessage
    });
    throw new Error(errorMessage);
  }
};

export const downloadFile = async (file: UploadedFile): Promise<void> => {
  try {
    // Fetch the file from Firebase Storage
    const response = await fetch(file.downloadUrl);
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
};

export const deleteFile = async (file: UploadedFile): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to delete files');
  }

  // Verify the file belongs to the current user
  if (file.userId !== auth.currentUser.uid) {
    throw new Error('Unauthorized: Cannot delete files from other users');
  }

  try {
    const storageRef = ref(storage, file.path);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

export const getFileContent = async (file: UploadedFile): Promise<string> => {
  // Check if it's a text file
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const textExtensions = ALLOWED_FILE_TYPES.text;
  
  if (!textExtensions.includes(extension) && !file.type.startsWith('text/')) {
    throw new Error('File is not a text file');
  }

  // Check file size limit for text preview (1MB)
  if (file.size > 1024 * 1024) {
    throw new Error('File too large for preview. Maximum size for text preview is 1MB.');
  }

  try {
    // Fetch file content from Firebase Storage
    const response = await fetch(file.downloadUrl);
    const text = await response.text();
    
    // Security: Sanitize content
    let sanitizedContent = text
      .replace(/<script[^>]*>.*?<\/script>/gis, '[SCRIPT REMOVED FOR SECURITY]')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '[IFRAME REMOVED FOR SECURITY]')
      .replace(/javascript:/gi, 'javascript-removed:')
      .replace(/data:text\/html/gi, 'data-html-removed:')
      .replace(/vbscript:/gi, 'vbscript-removed:');
    
    // Limit content length for display (50KB)
    if (sanitizedContent.length > 50000) {
      sanitizedContent = sanitizedContent.substring(0, 50000) + '\n\n[Content truncated - file too large for full preview]';
    }
    
    return sanitizedContent;
  } catch (error) {
    console.error('Error reading file content:', error);
    throw new Error('Failed to read file content');
  }
};

export const getUserFiles = async (projectId: string): Promise<UploadedFile[]> => {
  if (!auth.currentUser) {
    console.warn('No authenticated user found');
    throw new Error('User must be authenticated to access files');
  }

  try {
    const userId = auth.currentUser.uid;
    console.log('Fetching files for user:', userId, 'project:', projectId);

    const projectPath = `users/${userId}/projects/${projectId}/files/`;
    const storageRef = ref(storage, projectPath);

    console.log('Listing files at path:', projectPath);
    const result = await listAll(storageRef);
    console.log('Found', result.items.length, 'files');

    const files: UploadedFile[] = [];

    for (const itemRef of result.items) {
      try {
        console.log('Processing file:', itemRef.name);
        const metadata = await getMetadata(itemRef);
        const downloadUrl = await getDownloadURL(itemRef);

        // Extract file info from path
        const fileName = itemRef.name;
        const fileId = fileName.split('_')[0];
        const originalName = fileName.substring(fileName.indexOf('_') + 1);

        files.push({
          id: fileId,
          name: originalName,
          size: metadata.size,
          type: metadata.contentType || 'application/octet-stream',
          lastModified: metadata.timeCreated,
          url: downloadUrl,
          downloadUrl,
          path: itemRef.fullPath,
          projectId,
          userId
        });
      } catch (error) {
        console.warn('Error processing file:', itemRef.name, error);
      }
    }

    console.log('Successfully processed', files.length, 'files');
    return files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  } catch (error: any) {
    console.error('Error fetching user files:', error);

    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      console.error('Storage unauthorized. Check Firebase rules and authentication.');
      throw new Error('Access denied. Please check your permissions or try logging in again.');
    } else if (error.code === 'storage/object-not-found') {
      console.log('No files found in project:', projectId);
      return []; // Return empty array instead of throwing error
    } else {
      throw new Error(`Failed to fetch files: ${error.message}`);
    }
  }
};

export const isTextFile = (fileName: string, fileType?: string): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const textExtensions = ALLOWED_FILE_TYPES.text;
  return textExtensions.includes(extension) || 
         (fileType && fileType.startsWith('text/')) ||
         extension === '.html' || extension === '.css' || extension === '.scss' || extension === '.less';
};
