import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Type,
  Code,
  Hash,
  ScrollText,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/WorldClassComponents';
import { uploadFile, UploadedFile } from '../services/storageService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

interface AddTextContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTextUploaded: (file: UploadedFile) => void;
}

interface TextContentType {
  id: string;
  name: string;
  icon: React.ReactElement;
  extension: string;
  placeholder: string;
  description: string;
}

const textContentTypes: TextContentType[] = [
  {
    id: 'script',
    name: 'Script',
    icon: <ScrollText className="w-4 h-4" />,
    extension: '.txt',
    placeholder: 'Enter your script content here...\n\nExample:\n[INTRO]\nHey everyone, welcome back to my channel!\n\n[MAIN CONTENT]\nToday we\'re going to talk about...',
    description: 'Video scripts, dialogue, or any narrative content'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <FileText className="w-4 h-4" />,
    extension: '.md',
    placeholder: '# Project Notes\n\n## Ideas\n- Idea 1\n- Idea 2\n\n## Todo\n- [ ] Task 1\n- [ ] Task 2\n\n## Resources\n- [Link 1](https://example.com)\n- [Link 2](https://example.com)',
    description: 'Project notes, ideas, and documentation'
  },
  {
    id: 'code',
    name: 'Code Snippet',
    icon: <Code className="w-4 h-4" />,
    extension: '.js',
    placeholder: '// Enter your code here\n\nconst myFunction = () => {\n  console.log("Hello, world!");\n};\n\nmyFunction();',
    description: 'Code snippets, functions, or development notes'
  },
  {
    id: 'hashtags',
    name: 'Hashtags',
    icon: <Hash className="w-4 h-4" />,
    extension: '.txt',
    placeholder: '#trending #viral #content #creator #youtube #social #media #engagement #growth #tips',
    description: 'Hashtag collections for social media posts'
  },
  {
    id: 'ideas',
    name: 'Ideas & Concepts',
    icon: <Lightbulb className="w-4 h-4" />,
    extension: '.md',
    placeholder: '# Content Ideas\n\n## Video Ideas\n1. How to get started with...\n2. Top 10 tips for...\n3. My experience with...\n\n## Thumbnail Ideas\n- Bright colors with contrast\n- Face expressions: surprised, excited\n- Text overlay: "AMAZING RESULTS"\n\n## Hook Ideas\n- "You won\'t believe what happened next..."\n- "This changed everything for me..."',
    description: 'Creative ideas, concepts, and brainstorming content'
  },
  {
    id: 'custom',
    name: 'Custom Text',
    icon: <Type className="w-4 h-4" />,
    extension: '.txt',
    placeholder: 'Enter any custom text content...',
    description: 'Any other text content you want to save'
  }
];

const AddTextContentModal: React.FC<AddTextContentModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onTextUploaded
}) => {
  const [authUser] = useAuthState(auth);
  const [selectedType, setSelectedType] = useState<TextContentType>(textContentTypes[0]);
  const [fileName, setFileName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedType(textContentTypes[0]);
      setFileName('');
      setTextContent('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  // Update placeholder when type changes
  React.useEffect(() => {
    setTextContent(selectedType.placeholder);
  }, [selectedType]);

  const handleSave = useCallback(async () => {
    if (!authUser) {
      setError('You must be logged in to save content');
      return;
    }

    if (!fileName.trim()) {
      setError('Please enter a file name');
      return;
    }

    if (!textContent.trim()) {
      setError('Please enter some text content');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Create a blob from the text content
      const blob = new Blob([textContent], { type: 'text/plain' });
      
      // Create a file object
      const fullFileName = fileName.includes('.') ? fileName : `${fileName}${selectedType.extension}`;
      const file = new File([blob], fullFileName, { type: 'text/plain' });

      // Upload the file
      const uploadedFile = await uploadFile(file, projectId);
      
      setSuccess(true);
      onTextUploaded(uploadedFile);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving text content:', error);
      setError(error instanceof Error ? error.message : 'Failed to save content');
    } finally {
      setIsUploading(false);
    }
  }, [authUser, fileName, textContent, selectedType, projectId, onTextUploaded, onClose]);

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
          className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Add Text Content</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Create and save text content directly to your project
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
            {/* Content Type Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Content Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {textContentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${
                      selectedType.id === type.id
                        ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${
                        selectedType.id === type.id 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        {type.icon}
                      </div>
                      <span className="font-medium text-white text-sm">{type.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* File Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                File Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={`my-${selectedType.id}`}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                  {selectedType.extension}
                </div>
              </div>
            </div>

            {/* Text Content Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200 font-mono text-sm leading-relaxed resize-none"
                placeholder={selectedType.placeholder}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Tip: Use this space to organize your scripts, notes, ideas, and other text content</span>
                <span>{textContent.length} characters</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-400">Content saved successfully!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isUploading || !fileName.trim() || !textContent.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Content
                  </>
                )}
              </Button>
            </div>

            {/* Authentication Notice */}
            {!authUser && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">You must be logged in to save content</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTextContentModal;
