import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayersIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  StarIcon,
  FilterIcon,
  FolderIcon,
  TagIcon,
  ClockIcon,
  ShareIcon,
  CheckIcon,
  AlertIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  SparklesIcon
} from './ProfessionalIcons';
import { Button, Card, Badge, Input } from './ui/WorldClassComponents';
import { PromptTemplate } from '../../types';

interface AdvancedTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PromptTemplate[];
  onSaveTemplate: (template: PromptTemplate) => void;
  onLoadTemplate: (template: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate: (template: PromptTemplate) => void;
  currentState: {
    platform: string;
    contentType: string;
    userInput: string;
    targetAudience: string;
    seoKeywords: string;
    [key: string]: any;
  };
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'name' | 'usage' | 'rating';
type FilterCategory = 'all' | 'favorites' | 'recent' | 'platform' | 'content-type';

const AdvancedTemplateManager: React.FC<AdvancedTemplateManagerProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  currentState
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'general',
    tags: [] as string[],
    isPublic: false
  });

  // Simulated usage data - in real app this would come from analytics
  const templateUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    templates.forEach(template => {
      usage[template.id] = Math.floor(Math.random() * 50) + 1;
    });
    return usage;
  }, [templates]);

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.contentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.platform.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' ||
        (selectedCategory === 'favorites' && favorites.has(template.id)) ||
        (selectedCategory === 'platform' && template.platform === currentState.platform) ||
        (selectedCategory === 'content-type' && template.contentType === currentState.contentType);
      
      return matchesSearch && matchesCategory;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'usage':
          return (templateUsage[b.id] || 0) - (templateUsage[a.id] || 0);
        case 'rating':
          return (Math.random() - 0.5); // Simulated rating
        case 'recent':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [templates, searchQuery, selectedCategory, sortBy, favorites, currentState, templateUsage]);

  const handleSaveNewTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: PromptTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      ...currentState,
      createdAt: new Date().toISOString(),
      category: newTemplate.category,
      tags: newTemplate.tags,
      isPublic: newTemplate.isPublic
    };

    onSaveTemplate(template);
    setNewTemplate({ name: '', description: '', category: 'general', tags: [], isPublic: false });
    setShowCreateForm(false);
  };

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const handleBulkAction = (action: 'delete' | 'export' | 'favorite') => {
    switch (action) {
      case 'delete':
        selectedTemplates.forEach(id => onDeleteTemplate(id));
        setSelectedTemplates(new Set());
        break;
      case 'export':
        setShowExportModal(true);
        break;
      case 'favorite':
        selectedTemplates.forEach(id => toggleFavorite(id));
        setSelectedTemplates(new Set());
        break;
    }
  };

  const categories = [
    { id: 'all', label: 'All Templates', icon: LayersIcon, count: templates.length },
    { id: 'favorites', label: 'Favorites', icon: StarIcon, count: favorites.size },
    { id: 'recent', label: 'Recent', icon: ClockIcon, count: templates.filter(t => 
      new Date().getTime() - new Date(t.createdAt || 0).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length },
    { id: 'platform', label: currentState.platform, icon: FolderIcon, count: templates.filter(t => t.platform === currentState.platform).length },
    { id: 'content-type', label: currentState.contentType, icon: TagIcon, count: templates.filter(t => t.contentType === currentState.contentType).length }
  ];

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
          className="w-full max-w-7xl h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LayersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Template Manager</h2>
                <p className="text-slate-400">Organize, save, and reuse your content strategies</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="glow" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {templates.length} Templates
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <span className="text-slate-400 text-xl">×</span>
              </Button>
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 p-6 overflow-y-auto">
              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="primary"
                  fullWidth
                  icon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => setShowCreateForm(true)}
                >
                  Save Current Setup
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<UploadIcon className="w-4 h-4" />}
                    onClick={() => setShowImportModal(true)}
                  >
                    Import
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<DownloadIcon className="w-4 h-4" />}
                    onClick={() => setShowExportModal(true)}
                  >
                    Export
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Categories</h3>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id as FilterCategory)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <Badge variant="ghost" size="sm">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              {/* Advanced Filters */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center justify-between w-full p-3 text-slate-400 hover:text-slate-300 rounded-lg hover:bg-slate-700/30 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <FilterIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Advanced Filters</span>
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs text-slate-400 mb-2">Sort by</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortOption)}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="name">Name (A-Z)</option>
                          <option value="usage">Most Used</option>
                          <option value="rating">Top Rated</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search and Controls */}
              <div className="p-6 border-b border-slate-700/50 bg-slate-800/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {selectedTemplates.size > 0 && (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <span className="text-sm text-blue-400">{selectedTemplates.size} selected</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<TrashIcon className="w-4 h-4" />}
                          onClick={() => handleBulkAction('delete')}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<StarIcon className="w-4 h-4" />}
                          onClick={() => handleBulkAction('favorite')}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<DownloadIcon className="w-4 h-4" />}
                          onClick={() => handleBulkAction('export')}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1 p-1 bg-slate-700/50 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <LayersIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <LayersIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-400">{templates.length}</div>
                    <div className="text-xs text-slate-400">Total Templates</div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-400">{favorites.size}</div>
                    <div className="text-xs text-slate-400">Favorites</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-400">
                      {Object.values(templateUsage).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-slate-400">Total Uses</div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-amber-400">
                      {templates.filter(t => 
                        new Date().getTime() - new Date(t.createdAt || 0).getTime() < 7 * 24 * 60 * 60 * 1000
                      ).length}
                    </div>
                    <div className="text-xs text-slate-400">This Week</div>
                  </div>
                </div>
              </div>

              {/* Templates Grid/List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredAndSortedTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-24 h-24 bg-slate-700/30 rounded-full flex items-center justify-center mb-4">
                      <LayersIcon className="w-12 h-12 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No Templates Found</h3>
                    <p className="text-slate-400 text-center max-w-md mb-6">
                      {searchQuery 
                        ? `No templates match "${searchQuery}". Try adjusting your search or filters.`
                        : "Create your first template by saving your current generator settings."
                      }
                    </p>
                    <Button
                      variant="primary"
                      icon={<PlusIcon className="w-4 h-4" />}
                      onClick={() => setShowCreateForm(true)}
                    >
                      Create First Template
                    </Button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-3"
                  }>
                    {filteredAndSortedTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        viewMode={viewMode}
                        isSelected={selectedTemplates.has(template.id)}
                        isFavorite={favorites.has(template.id)}
                        usage={templateUsage[template.id] || 0}
                        onSelect={() => {
                          const newSelected = new Set(selectedTemplates);
                          if (newSelected.has(template.id)) {
                            newSelected.delete(template.id);
                          } else {
                            newSelected.add(template.id);
                          }
                          setSelectedTemplates(newSelected);
                        }}
                        onLoad={() => onLoadTemplate(template)}
                        onEdit={() => {/* Handle edit */}}
                        onDuplicate={() => onDuplicateTemplate(template)}
                        onDelete={() => onDeleteTemplate(template.id)}
                        onToggleFavorite={() => toggleFavorite(template.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Create Template Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <CreateTemplateModal
              newTemplate={newTemplate}
              setNewTemplate={setNewTemplate}
              currentState={currentState}
              onSave={handleSaveNewTemplate}
              onClose={() => setShowCreateForm(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: PromptTemplate;
  viewMode: ViewMode;
  isSelected: boolean;
  isFavorite: boolean;
  usage: number;
  onSelect: () => void;
  onLoad: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  viewMode,
  isSelected,
  isFavorite,
  usage,
  onSelect,
  onLoad,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite
}) => {
  const [showActions, setShowActions] = useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        className={`flex items-center p-4 bg-slate-800/30 hover:bg-slate-800/50 border rounded-lg transition-all ${
          isSelected ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700/50'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mr-4 w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-slate-200 truncate">{template.name}</h3>
            {isFavorite && <StarIcon className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="ghost" size="sm">{template.platform}</Badge>
            <Badge variant="ghost" size="sm">{template.contentType}</Badge>
            <span className="text-xs text-slate-500">Used {usage} times</span>
          </div>
        </div>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-2"
            >
              <Button variant="ghost" size="sm" icon={<StarIcon className="w-4 h-4" />} onClick={onToggleFavorite} />
              <Button variant="secondary" size="sm" onClick={onLoad}>Load</Button>
              <Button variant="ghost" size="sm" icon={<EditIcon className="w-4 h-4" />} onClick={onEdit} />
              <Button variant="ghost" size="sm" icon={<CopyIcon className="w-4 h-4" />} onClick={onDuplicate} />
              <Button variant="ghost" size="sm" icon={<TrashIcon className="w-4 h-4" />} onClick={onDelete} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all hover:shadow-xl ${
        isSelected ? 'border-blue-500/50 shadow-blue-500/20' : 'border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 rounded border-slate-600 bg-slate-700"
        />
      </div>

      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 z-10 p-1 rounded-md bg-slate-900/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <StarIcon className={`w-4 h-4 ${isFavorite ? 'text-amber-400' : 'text-slate-400'}`} />
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-200 mb-1 line-clamp-1">{template.name}</h3>
          {template.description && (
            <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="ghost" size="sm">{template.platform}</Badge>
          <Badge variant="ghost" size="sm">{template.contentType}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span>Used {usage} times</span>
          <span>{new Date(template.createdAt || 0).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="primary" size="sm" fullWidth onClick={onLoad}>
            Load Template
          </Button>
          <Button variant="ghost" size="sm" icon={<EditIcon className="w-4 h-4" />} onClick={onEdit} />
          <Button variant="ghost" size="sm" icon={<CopyIcon className="w-4 h-4" />} onClick={onDuplicate} />
        </div>
      </div>

      {/* Usage Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(usage / 50 * 100, 100)}%` }}
        />
      </div>
    </motion.div>
  );
};

// Create Template Modal Component
interface CreateTemplateModalProps {
  newTemplate: any;
  setNewTemplate: (template: any) => void;
  currentState: any;
  onSave: () => void;
  onClose: () => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  newTemplate,
  setNewTemplate,
  currentState,
  onSave,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Save Current Setup</h3>
              <p className="text-slate-400">Create a template from your current generator settings</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <span className="text-slate-400 text-xl">×</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Setup Preview */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Current Setup</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-500">Platform:</span>
                <div className="text-sm text-slate-300">{currentState.platform}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Content Type:</span>
                <div className="text-sm text-slate-300">{currentState.contentType}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Target Audience:</span>
                <div className="text-sm text-slate-300">{currentState.targetAudience || 'Not specified'}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Input Length:</span>
                <div className="text-sm text-slate-300">{currentState.userInput?.length || 0} characters</div>
              </div>
            </div>
          </div>

          {/* Template Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
              <Input
                type="text"
                placeholder="e.g. LinkedIn Thought Leadership Post"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                placeholder="Describe what this template is for and when to use it..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300 placeholder-slate-500 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300"
                >
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="social-media">Social Media</option>
                  <option value="blog">Blog Content</option>
                  <option value="video">Video Content</option>
                  <option value="email">Email Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
                <div className="flex items-center space-x-3 pt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!newTemplate.isPublic}
                      onChange={() => setNewTemplate({ ...newTemplate, isPublic: false })}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-slate-300">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={newTemplate.isPublic}
                      onChange={() => setNewTemplate({ ...newTemplate, isPublic: true })}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-slate-300">Public</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-slate-700/50">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={onSave}
              disabled={!newTemplate.name.trim()}
              icon={<CheckIcon className="w-4 h-4" />}
            >
              Save Template
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedTemplateManager;
