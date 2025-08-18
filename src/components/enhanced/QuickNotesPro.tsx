import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StickyNote,
  Plus,
  Search,
  Tag,
  X,
  Pin,
  Archive,
  Edit3,
  Trash2,
  Filter,
  Calendar,
  Clock,
  Hash,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Star,
  MessageSquare,
  PaperclipIcon,
  Link,
  Image,
  Mic,
  Video,
  ChevronDown,
  Copy,
  Share2,
  MoreHorizontal
} from "lucide-react";
import { Button, Card, Badge } from "../ui/WorldClassComponents";

interface QuickNote {
  id: string;
  title: string;
  content: string;
  category: 'idea' | 'task' | 'inspiration' | 'reminder' | 'research' | 'personal';
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  hasAttachment: boolean;
  attachmentType?: 'image' | 'audio' | 'video' | 'link';
  reminder?: Date;
}

interface NoteCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

interface QuickNotesProProps {
  onNoteCreate?: (note: QuickNote) => void;
  onNoteUpdate?: (note: QuickNote) => void;
  onNoteDelete?: (noteId: string) => void;
}

const QuickNotesPro: React.FC<QuickNotesProProps> = ({
  onNoteCreate,
  onNoteUpdate,
  onNoteDelete
}) => {
  const [notes, setNotes] = useState<QuickNote[]>([
    // Mock notes commented out for clean user experience
    /*
    {
      id: '1',
      title: 'Video Ideas',
      content: 'AI productivity tools comparison, Morning routine optimization',
      category: 'idea',
      tags: ['content', 'video', 'ai'],
      isPinned: true,
      isArchived: false,
      color: '#3b82f6',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      priority: 'high',
      hasAttachment: false
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: 'Discuss Q2 strategy, Review analytics dashboard, Plan content calendar',
      category: 'task',
      tags: ['meeting', 'strategy'],
      isPinned: false,
      isArchived: false,
      color: '#10b981',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      priority: 'medium',
      hasAttachment: true,
      attachmentType: 'link'
    },
    {
      id: '3',
      title: 'Inspiration Quote',
      content: '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
      category: 'inspiration',
      tags: ['quotes', 'motivation'],
      isPinned: false,
      isArchived: false,
      color: '#f59e0b',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'low',
      hasAttachment: false
    }
    */
  ]);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuickNote['category']>('idea');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: NoteCategory[] = [
    { id: 'idea', name: 'Ideas', icon: <Lightbulb className="w-4 h-4" />, color: '#3b82f6', count: 0 },
    { id: 'task', name: 'Tasks', icon: <Target className="w-4 h-4" />, color: '#10b981', count: 0 },
    { id: 'inspiration', name: 'Inspiration', icon: <Heart className="w-4 h-4" />, color: '#f59e0b', count: 0 },
    { id: 'reminder', name: 'Reminders', icon: <Clock className="w-4 h-4" />, color: '#ef4444', count: 0 },
    { id: 'research', name: 'Research', icon: <Search className="w-4 h-4" />, color: '#8b5cf6', count: 0 },
    { id: 'personal', name: 'Personal', icon: <Star className="w-4 h-4" />, color: '#06b6d4', count: 0 }
  ];

  const noteColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6b7280'
  ];

  // Update category counts
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: notes.filter(note => note.category === cat.id && !note.isArchived).length
  }));

  const filteredNotes = notes.filter(note => {
    if (note.isArchived) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!note.title.toLowerCase().includes(query) && 
          !note.content.toLowerCase().includes(query) &&
          !note.tags.some(tag => tag.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    if (selectedTags.length > 0) {
      if (!selectedTags.every(tag => note.tags.includes(tag))) {
        return false;
      }
    }
    
    return true;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: QuickNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim() || 'Untitled Note',
      content: newNoteContent.trim(),
      category: selectedCategory,
      tags: [],
      isPinned: false,
      isArchived: false,
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      hasAttachment: false
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteContent('');
    setNewNoteTitle('');
    setShowAddNote(false);
    onNoteCreate?.(newNote);
  };

  const updateNote = (noteId: string, updates: Partial<QuickNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    onNoteDelete?.(noteId);
  };

  const togglePin = (noteId: string) => {
    updateNote(noteId, { isPinned: !notes.find(n => n.id === noteId)?.isPinned });
  };

  const archiveNote = (noteId: string) => {
    updateNote(noteId, { isArchived: true });
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const NoteCard = ({ note }: { note: QuickNote }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="relative group"
    >
      <div
        className="p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden"
        style={{
          borderColor: note.isPinned ? note.color : 'var(--border-primary)',
          backgroundColor: note.isPinned ? `${note.color}10` : 'var(--surface-secondary)'
        }}
        onClick={() => setEditingNote(editingNote === note.id ? null : note.id)}
      >
        {/* Priority indicator */}
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{
            backgroundColor: note.priority === 'high' ? '#ef4444' : 
                            note.priority === 'medium' ? '#f59e0b' : '#6b7280'
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: note.color }}
            >
              {categoriesWithCounts.find(c => c.id === note.category)?.icon}
            </div>
            <div>
              <h4 className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">
                {note.title}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="neutral" className="text-xs capitalize">
                  {note.category}
                </Badge>
                {note.hasAttachment && (
                  <PaperclipIcon className="w-3 h-3 text-[var(--text-tertiary)]" />
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id);
              }}
            >
              <Pin className={`w-3 h-3 ${note.isPinned ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}`} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                archiveNote(note.id);
              }}
            >
              <Archive className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-3">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] rounded-md text-xs">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span>{formatTimeAgo(note.updatedAt)}</span>
          <div className="flex items-center space-x-2">
            {note.reminder && (
              <Clock className="w-3 h-3" />
            )}
            <MoreHorizontal className="w-3 h-3" />
          </div>
        </div>

        {/* Expanded Edit Mode */}
        <AnimatePresence>
          {editingNote === note.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[var(--border-primary)]"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => updateNote(note.id, { title: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
                />
                <textarea
                  value={note.content}
                  onChange={(e) => updateNote(note.id, { content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <select
                      value={note.category}
                      onChange={(e) => updateNote(note.id, { category: e.target.value as QuickNote['category'] })}
                      className="px-2 py-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded text-xs"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <select
                      value={note.priority}
                      onChange={(e) => updateNote(note.id, { priority: e.target.value as QuickNote['priority'] })}
                      className="px-2 py-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded text-xs"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-1">
                    {noteColors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateNote(note.id, { color })}
                        className={`w-4 h-4 rounded-full border-2 ${
                          note.color === color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
              <StickyNote className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">Quick Notes</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {notes.filter(n => !n.isArchived).length} notes • {pinnedNotes.length} pinned
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => setShowAddNote(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categoriesWithCounts.map(category => (
                      <Badge
                        key={category.id}
                        variant="neutral"
                        className="cursor-pointer transition-all"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          borderColor: category.color
                        }}
                      >
                        {category.icon}
                        <span className="ml-1">{category.name}</span>
                        <span className="ml-1 opacity-60">({category.count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {allTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags(prev => 
                              prev.includes(tag) 
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                          className={`px-2 py-1 rounded-md text-xs transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-[var(--brand-primary)] text-white'
                              : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--surface-quaternary)]'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add New Note */}
        <AnimatePresence>
          {showAddNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-primary)]"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
                />
                <textarea
                  placeholder="Write your note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && addNote()}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as QuickNote['category'])}
                    className="px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={addNote}>
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Grid */}
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center">
                <Pin className="w-4 h-4 mr-2" />
                Pinned Notes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pinnedNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  Recent Notes
                </h4>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regularNotes.slice(0, 6).map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-8">
            <StickyNote className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuickNotesPro;
