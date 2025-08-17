import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Flag,
  User,
  Tag,
  FileText,
  Image,
  PlayCircle,
  BarChart3,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Plus,
  ChevronDown,
  Upload,
  Globe,
} from "lucide-react";
import { Button, Card } from "./ui/WorldClassComponents";

export interface NewProjectData {
  title: string;
  description: string;
  type: 'video' | 'thumbnail' | 'strategy' | 'analytics' | 'content';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  platform: string;
  dueDate?: Date;
  estimatedHours?: number;
  tags: string[];
  assignee: string;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: NewProjectData) => void;
  userPlan?: string;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userPlan = "free"
}) => {
  const [formData, setFormData] = useState<NewProjectData>({
    title: "",
    description: "",
    type: "content",
    priority: "medium",
    platform: "YouTube",
    tags: [],
    assignee: "You"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [tagInput, setTagInput] = useState("");
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        type: "content",
        priority: "medium",
        platform: "YouTube",
        tags: [],
        assignee: "You"
      });
      setErrors({});
      setCurrentStep(1);
      setTagInput("");
    }
  }, [isOpen]);

  const projectTypes = [
    { value: 'video', label: 'Video Content', icon: <PlayCircle className="w-4 h-4" />, description: 'Full video production project' },
    { value: 'content', label: 'Content Piece', icon: <FileText className="w-4 h-4" />, description: 'Blog post, script, or written content' },
    { value: 'thumbnail', label: 'Thumbnail Design', icon: <Image className="w-4 h-4" />, description: 'Visual thumbnail creation' },
    { value: 'strategy', label: 'Strategy Planning', icon: <Target className="w-4 h-4" />, description: 'Content strategy and planning' },
    { value: 'analytics', label: 'Analytics Review', icon: <BarChart3 className="w-4 h-4" />, description: 'Performance analysis and reporting' }
  ];

  const platforms = [
    'YouTube', 'Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 
    'Facebook', 'Pinterest', 'Snapchat', 'Multi-Platform', 'Other'
  ];

  const priorityColors = {
    low: { color: '#22c55e', bg: '#22c55e10' },
    medium: { color: '#eab308', bg: '#eab30810' },
    high: { color: '#f97316', bg: '#f9731610' },
    urgent: { color: '#ef4444', bg: '#ef444410' }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Project title is required";
      } else if (formData.title.length < 3) {
        newErrors.title = "Title must be at least 3 characters";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Project description is required";
      } else if (formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
    }

    if (step === 2) {
      if (formData.estimatedHours && (formData.estimatedHours < 0.5 || formData.estimatedHours > 500)) {
        newErrors.estimatedHours = "Estimated hours must be between 0.5 and 500";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      if (formData.tags.length < 10) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NewProjectData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (step === currentStep) return <div className="w-5 h-5 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-sm font-bold">{step}</div>;
    return <div className="w-5 h-5 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] text-sm">{step}</div>;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[var(--surface-primary)] rounded-2xl shadow-2xl border border-[var(--border-primary)] w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--brand-primary)]10 to-[var(--brand-secondary)]10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Create New Project
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Set up your project details and get started
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                {getStepIcon(1)}
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  Project Details
                </span>
              </div>
              <div className="h-px bg-[var(--border-primary)] flex-1" />
              <div className="flex items-center space-x-2">
                {getStepIcon(2)}
                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  Configuration
                </span>
              </div>
              <div className="h-px bg-[var(--border-primary)] flex-1" />
              <div className="flex items-center space-x-2">
                {getStepIcon(3)}
                <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  Review
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {/* Step 1: Project Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a descriptive project title..."
                      className={`w-full px-4 py-3 bg-[var(--surface-secondary)] border rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all ${
                        errors.title ? 'border-red-500' : 'border-[var(--border-primary)]'
                      }`}
                    />
                    {errors.title && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Project Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projectTypes.map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.type === type.value
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]10'
                              : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]50'
                          }`}
                          onClick={() => handleInputChange('type', type.value)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              formData.type === type.value 
                                ? 'bg-[var(--brand-primary)] text-white' 
                                : 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]'
                            }`}>
                              {type.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] text-sm">
                                {type.label}
                              </h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Project Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what this project will accomplish..."
                      rows={4}
                      className={`w-full px-4 py-3 bg-[var(--surface-secondary)] border rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all resize-none ${
                        errors.description ? 'border-red-500' : 'border-[var(--border-primary)]'
                      }`}
                    />
                    {errors.description && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.description}</span>
                      </div>
                    )}
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">
                      {formData.description.length}/500 characters
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Priority and Platform Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                          <motion.button
                            key={priority}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleInputChange('priority', priority)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.priority === priority
                                ? 'border-current'
                                : 'border-[var(--border-primary)] hover:border-current'
                            }`}
                            style={{
                              color: priorityColors[priority].color,
                              backgroundColor: formData.priority === priority ? priorityColors[priority].bg : 'transparent'
                            }}
                          >
                            <Flag className="w-4 h-4 mx-auto mb-1" />
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Target Platform
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                          className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl text-left flex items-center justify-between focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>{formData.platform}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                        </button>
                        
                        <AnimatePresence>
                          {showPlatformDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-10 w-full mt-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl shadow-lg max-h-40 overflow-y-auto"
                            >
                              {platforms.map((platform) => (
                                <button
                                  key={platform}
                                  onClick={() => {
                                    handleInputChange('platform', platform);
                                    setShowPlatformDropdown(false);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-[var(--surface-secondary)] transition-colors text-sm"
                                >
                                  {platform}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Due Date and Estimated Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Due Date (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
                        />
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-[var(--text-tertiary)] pointer-events-none" />
                      </div>
                    </div>

                    {/* Estimated Hours */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Estimated Hours (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="500"
                          value={formData.estimatedHours || ''}
                          onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="8"
                          className={`w-full px-4 py-3 bg-[var(--surface-secondary)] border rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none ${
                            errors.estimatedHours ? 'border-red-500' : 'border-[var(--border-primary)]'
                          }`}
                        />
                        <Clock className="absolute right-3 top-3 w-5 h-5 text-[var(--text-tertiary)] pointer-events-none" />
                      </div>
                      {errors.estimatedHours && (
                        <div className="flex items-center space-x-1 mt-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.estimatedHours}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Tags (Optional)
                    </label>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          placeholder="Add a tag..."
                          className="flex-1 px-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleAddTag}
                          disabled={!tagInput.trim() || formData.tags.length >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center space-x-1 px-3 py-1 bg-[var(--brand-primary)]15 text-[var(--brand-primary)] rounded-full text-sm"
                            >
                              <Tag className="w-3 h-3" />
                              <span>{tag}</span>
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-[var(--text-tertiary)]">
                        {formData.tags.length}/10 tags
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      Review Your Project
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Check the details below and create your project
                    </p>
                  </div>

                  <Card>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-[var(--brand-primary)]15">
                          {projectTypes.find(t => t.value === formData.type)?.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--text-primary)]">{formData.title}</h4>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{formData.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-primary)]">
                        <div>
                          <p className="text-xs text-[var(--text-tertiary)] mb-1">Type</p>
                          <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                            {formData.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-tertiary)] mb-1">Priority</p>
                          <div className="flex items-center space-x-1">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: priorityColors[formData.priority].color }}
                            />
                            <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                              {formData.priority}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-tertiary)] mb-1">Platform</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {formData.platform}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-tertiary)] mb-1">Due Date</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {formData.dueDate ? formData.dueDate.toLocaleDateString() : 'Not set'}
                          </p>
                        </div>
                      </div>

                      {formData.estimatedHours && (
                        <div className="pt-2 border-t border-[var(--border-primary)]">
                          <p className="text-xs text-[var(--text-tertiary)] mb-1">Estimated Hours</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {formData.estimatedHours} hours
                          </p>
                        </div>
                      )}

                      {formData.tags.length > 0 && (
                        <div className="pt-2 border-t border-[var(--border-primary)]">
                          <p className="text-xs text-[var(--text-tertiary)] mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1">
                            {formData.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-[var(--brand-primary)]10 text-[var(--brand-primary)] rounded-md text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {userPlan === "free" && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-500 text-sm">Free Plan Notice</h4>
                          <p className="text-xs text-yellow-500/80 mt-1">
                            You can create up to 5 projects on the free plan. Upgrade to Pro for unlimited projects and advanced features.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border-primary)] bg-[var(--surface-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button variant="ghost" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                {currentStep < 3 ? (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewProjectModal;
