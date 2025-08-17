import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

interface Note {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  timestamp: Date;
}

const PRESET_COLORS = [
  "bg-yellow-400",
  "bg-blue-400", 
  "bg-green-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-orange-400",
];

const QuickNotesPanel: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('studioHub:quickNotes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes.map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp)
      })));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('studioHub:quickNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent,
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      position: { x: 0, y: 0 },
      timestamp: new Date(),
    };

    setNotes(prev => [...prev, newNote]);
    setNewNoteContent("");
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (!editContent.trim()) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNoteId 
        ? { ...note, content: editContent, timestamp: new Date() }
        : note
    ));
    setEditingNoteId(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  return (
    <div className="quick-notes-panel bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Quick Notes</h3>
          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
            {notes.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {/* Add New Note */}
            <div className="space-y-2">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Add a quick note or idea..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addNote();
                  }
                }}
              />
              <button
                onClick={addNote}
                disabled={!newNoteContent.trim()}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <LightBulbIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes yet. Add one above!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`${note.color}/20 border border-current/30 rounded-lg p-3 group relative`}
                    style={{ borderColor: note.color.replace('bg-', '').replace('-400', '') }}
                  >
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm resize-none"
                          rows={2}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              saveEdit();
                            } else if (e.key === 'Escape') {
                              cancelEdit();
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs bg-slate-500 hover:bg-slate-600 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-white text-sm leading-relaxed pr-8">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-400">
                            {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(note)}
                              className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition-colors"
                              title="Edit note"
                            >
                              <PencilIcon className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="p-1 hover:bg-red-600 rounded text-slate-400 hover:text-red-300 transition-colors"
                              title="Delete note"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {notes.length > 0 && (
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-600">
                <p>💡 Tip: Press Ctrl+Enter to quickly add notes</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickNotesPanel;
