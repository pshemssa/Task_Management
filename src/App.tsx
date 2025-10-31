// src/App.tsx
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { StickyNote } from './types';
import { StickyNoteCard as StickyNoteComponent } from './components/StickyNoteCard';
import { AddNoteButton } from './components/AddNoteButton';

const COLORS = ['yellow', 'pink', 'green', 'blue', 'purple'];

function App() {
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem('sticky-notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [notes, isDarkMode]);

  const addNote = () => {
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      text: '',
      dueDate: undefined,
      completed: false,
      x: window.innerWidth / 2 - 128,
      y: window.innerHeight / 2 - 100,
      z: Math.max(...notes.map(n => n.z), 0) + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, ...updates } : note))
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const bringToTop = (id: string) => {
    const maxZ = Math.max(...notes.map(n => n.z), 0);
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, z: maxZ + 1 } : note))
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-sky-50 via-white to-indigo-50'
      }`}
    >
      {/* Title */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center py-6 pointer-events-none">
        <h1
          className={`text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          To-Do List
        </h1>
      </header>

      {/* Dark-mode toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all z-50 pointer-events-auto ${
          isDarkMode
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* Notes */}
      {notes.map(note => (
        <StickyNoteComponent
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onBringToTop={bringToTop}
          isDarkMode={isDarkMode}
          allNotes={notes}               // <-- pass the whole array
        />
      ))}

      {/* Add button */}
      <AddNoteButton onAdd={addNote} isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;