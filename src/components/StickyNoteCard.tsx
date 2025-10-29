// src/components/StickyNoteCard.tsx
import { Trash2, GripVertical, Calendar, CheckSquare, Square } from 'lucide-react';
import { StickyNote } from '../types';
import { useState, useRef, useEffect } from 'react';

const COLORS = ['yellow', 'pink', 'green', 'blue', 'purple'];

interface StickyNoteCardProps {
  note: StickyNote;
  onUpdate: (id: string, updates: Partial<StickyNote>) => void;
  onDelete: (id: string) => void;
  onBringToTop: (id: string) => void;
  isDarkMode: boolean;
}

export function StickyNoteCard({
  note,
  onUpdate,
  onDelete,
  onBringToTop,
  isDarkMode,
}: StickyNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [editDue, setEditDue] = useState(note.dueDate || '');
  const dragRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    yellow: isDarkMode ? 'bg-yellow-700/90 border-yellow-600' : 'bg-yellow-200 border-yellow-400',
    pink: isDarkMode ? 'bg-pink-700/90 border-pink-600' : 'bg-pink-200 border-pink-400',
    green: isDarkMode ? 'bg-green-700/90 border-green-600' : 'bg-green-200 border-green-400',
    blue: isDarkMode ? 'bg-blue-700/90 border-blue-600' : 'bg-blue-200 border-blue-400',
    purple: isDarkMode ? 'bg-purple-700/90 border-purple-600' : 'bg-purple-200 border-purple-400',
  };

  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  useEffect(() => {
    if (isEditing) {
      const textarea = dragRef.current?.querySelector('textarea');
      textarea?.focus();
    }
  }, [isEditing]);

  const handleDragStart = (e: React.DragEvent) => {
    onBringToTop(note.id);
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('text/plain', `${offsetX},${offsetY}`);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    const rect = document.body.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onUpdate(note.id, { x, y });
  };

  const saveEdit = () => {
    onUpdate(note.id, { text: editText.trim() || 'Untitled', dueDate: editDue || undefined });
    setIsEditing(false);
  };

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onClick={() => onBringToTop(note.id)}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        zIndex: note.z,
        cursor: 'move',
      }}
      className={`w-64 p-4 rounded-lg border-2 shadow-lg transition-all hover:shadow-xl ${
        colorClasses[note.color as keyof typeof colorClasses]
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <GripVertical size={18} className="text-gray-600" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="opacity-0 hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isEditing ? (
        <div onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={`w-full resize-none bg-transparent outline-none ${textColor} text-sm`}
            rows={3}
          />
          <input
            type="date"
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
            className={`mt-2 w-full text-xs px-1 py-0.5 rounded bg-white/20 ${textColor}`}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={saveEdit}
              className="flex-1 text-xs py-1 bg-white/30 rounded hover:bg-white/50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 text-xs py-1 bg-white/20 rounded hover:bg-white/30"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            onDoubleClick={() => setIsEditing(true)}
            className={`font-medium text-sm break-words ${note.completed ? 'line-through opacity-70' : ''} ${textColor}`}
          >
            {note.text || 'Untitled'}
          </div>

          {note.dueDate && (
            <div className={`text-xs flex items-center gap-1 mt-2 ${textColor} opacity-80`}>
              <Calendar size={12} />
              {new Date(note.dueDate).toLocaleDateString()}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(note.id, { completed: !note.completed });
              }}
              className="p-1 rounded hover:bg-white/20"
            >
              {note.completed ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-xs opacity-60 hover:opacity-100"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}