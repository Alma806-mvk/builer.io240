import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
  AlertCircle,
  CheckCircle,
  Loader2,
  HardDrive,
  Crown,
  Zap
} from 'lucide-react';
import { Button } from './ui/WorldClassComponents';
import { uploadFile, storageService, UploadedFile, UploadProgress } from '../services/storageService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';


interface ProjectFileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userPlan: 'free' | 'creator-pro' | 'agency-pro';
  existingFiles: UploadedFile[];
  totalUsedStorage: number; // Total storage used across all projects
  onFilesUploaded: (files: UploadedFile[]) => void;
  onUpgrade?: () => void;
}

// Storage and file size limits based on user plan
const PLAN_LIMITS = {
  'free': {
    totalStorage: 10 * 1024 * 1024, // 10 MB
    maxFileSize: 1 * 1024 * 1024, // 1 MB
    name: 'Free Plan',
    color: 'text-slate-400'
  },
  'creator-pro': {
    totalStorage: 10 * 1024 * 1024 * 1024, // 10 GB
    maxFileSize: 1 * 1024 * 1024 * 1024, // 1 GB
    name: 'Creator Pro',
    color: 'text-blue-400'
  },
  'agency-pro': {
    totalStorage: 100 * 1024 * 1024 * 1024, // 100 GB
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10 GB
    name: 'Agency Pro',
    color: 'text-purple-400'
  }
};

// File type icons
const getFileIcon = (fileType: string, fileName: string) => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const type = fileType?.toLowerCase() || '';

  if (type.includes('image') || ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(extension)) return ImageIcon;
  if (type.includes('video') || ['.mp4', '.avi', '.mov', '.wmv'].includes(extension)) return Video;
  if (type.includes('audio') || ['.mp3', '.wav', '.aac', '.ogg'].includes(extension)) return Music;
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(extension)) return Archive;
  return FileText;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Calculate progress percentage
const getStorageProgress = (used: number, total: number): number => {
  return Math.min((used / total) * 100, 100);
};

const ProjectFileUpload: React.FC<ProjectFileUploadProps> = ({
  isOpen,
  onClose,
  projectId,
  userPlan,
  existingFiles,
  totalUsedStorage,
  onFilesUploaded,
  onUpgrade
}) => {
  const [authUser, loading, authError] = useAuthState(auth);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [successFiles, setSuccessFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const planLimits = PLAN_LIMITS[userPlan];
  const remainingStorage = planLimits.totalStorage - totalUsedStorage;
  const storageProgress = getStorageProgress(totalUsedStorage, planLimits.totalStorage);

  // File validation (using Firebase storage service for security)
  const validateFiles = useCallback((files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    let totalSize = 0;

    for (const file of files) {
      // Check file size limit
      if (file.size > planLimits.maxFileSize) {
        errors.push(`${file.name} exceeds max file size (${formatFileSize(planLimits.maxFileSize)})`);
        continue;
      }

      totalSize += file.size;
      valid.push(file);
    }

    // Check total storage limit
    if (totalUsedStorage + totalSize > planLimits.totalStorage) {
      errors.push(`Upload would exceed storage limit. ${formatFileSize(remainingStorage)} remaining.`);
      return { valid: [], errors };
    }

    return { valid, errors };
  }, [planLimits, totalUsedStorage, remainingStorage]);

  // Handle file selection and upload to Firebase
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!authUser) {
      setErrors(['You must be logged in to upload files']);
      return;
    }

    const fileArray = Array.from(files);
    const { valid, errors: validationErrors } = validateFiles(fileArray);

    setErrors(validationErrors);

    if (valid.length === 0) return;

    setUploadingFiles(valid);
    setIsUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    try {
      // Upload files to Firebase Storage
      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const fileId = `file_${i}`;

        try {
          const uploadedFile = await uploadFile(file, projectId, (progress) => {
            setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          });

          uploadedFiles.push(uploadedFile);
          setSuccessFiles(prev => [...prev, uploadedFile]);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          setErrors(prev => [...prev, `${file.name}: ${errorMessage}`]);
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { fileId, progress: 0, status: 'error', error: errorMessage }
          }));
        }
      }

      // Notify parent of successful uploads
      if (uploadedFiles.length > 0) {
        onFilesUploaded(uploadedFiles);
      }

      // Clean up after successful uploads
      setTimeout(() => {
        setUploadingFiles([]);
        setUploadProgress({});
        setSuccessFiles([]);
        if (uploadedFiles.length > 0) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [validateFiles, projectId, onFilesUploaded, authUser, onClose]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div>
              <h2 className="text-xl font-bold text-white">Upload Files</h2>
              <p className="text-slate-400 text-sm mt-1">
                Add files to your project
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Storage: {storageService.getCurrentMode() === 'mock' ? 'Development Mode' : 'Firebase Storage'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Storage Status */}
            <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Storage Usage</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-slate-700/50 ${planLimits.color}`}>
                    {planLimits.name}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {formatFileSize(totalUsedStorage)} / {formatFileSize(planLimits.totalStorage)}
                </div>
              </div>
              
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    storageProgress > 80 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : storageProgress > 60
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${storageProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{storageProgress.toFixed(1)}% used</span>
                <span>{formatFileSize(remainingStorage)} remaining</span>
              </div>

              {userPlan === 'free' && storageProgress > 50 && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400 font-medium">Need more storage?</span>
                    </div>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={onUpgrade}
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Get up to 10GB with Creator Pro or 100GB with Agency Pro
                  </p>
                </div>
              )}
            </div>

            {/* Upload Limits Info */}
            <div className="mb-6 p-4 bg-slate-800/20 rounded-lg border border-slate-700/30">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Upload Limits</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Max file size:</span>
                  <span className="text-slate-300 ml-2 font-medium">
                    {formatFileSize(planLimits.maxFileSize)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Remaining storage:</span>
                  <span className="text-slate-300 ml-2 font-medium">
                    {formatFileSize(remainingStorage)}
                  </span>
                </div>
              </div>
            </div>


            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".txt,.md,.json,.csv,.xml,.log,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.swift,.kt,.scala,.yml,.yaml,.html,.css,.scss,.less,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.ico,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rtf,.zip,.rar,.7z,.tar,.gz,.mp4,.avi,.mov,.wmv,.mp3,.wav,.aac,.ogg"
              />
              
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-slate-300 mb-2">
                    {dragActive ? 'Drop files here' : 'Upload your files'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Drag & drop or click to browse
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                  <span>Images</span>
                  <span>•</span>
                  <span>Documents</span>
                  <span>•</span>
                  <span>Videos</span>
                  <span>•</span>
                  <span>Audio</span>
                  <span>•</span>
                  <span>Archives</span>
                </div>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-4 space-y-2">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium text-slate-300">Uploading Files</h3>
                {uploadingFiles.map((file, index) => {
                  const fileId = `file_${index}`;
                  const progressData = uploadProgress[fileId];
                  const progress = progressData?.progress || 0;
                  const isComplete = progressData?.status === 'completed';
                  const hasError = progressData?.status === 'error';
                  const isSuccessful = successFiles.some(f => f.name === file.name);
                  const FileIcon = getFileIcon(file.type, file.name);

                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                    >
                      <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-300 truncate">
                            {file.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            {isSuccessful || isComplete ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : hasError ? (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            )}
                            <span className="text-xs text-slate-500">
                              {isSuccessful || isComplete ? 'Complete' : hasError ? 'Error' : `${progress}%`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{formatFileSize(file.size)}</span>
                        </div>

                        <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                          <div
                            className={`h-1 rounded-full transition-all duration-300 ${
                              isSuccessful || isComplete
                                ? 'bg-green-500'
                                : hasError
                                ? 'bg-red-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${isSuccessful || isComplete ? 100 : progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-700/50">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Cancel'}
              </Button>
            </div>

            {/* Authentication Notice */}
            {!authUser && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">You must be logged in to upload files</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectFileUpload;
