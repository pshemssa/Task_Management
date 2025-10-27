import { Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDarkMode: boolean;
}

export function TaskItem({
  task,
  index,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging,
  isDarkMode,
}: TaskItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group flex items-center gap-3 rounded-lg p-4 shadow-sm border transition-all duration-200 hover:shadow-md cursor-move ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div
        className={`transition-colors ${
          isDarkMode
            ? 'text-gray-500 group-hover:text-blue-400'
            : 'text-gray-400 group-hover:text-blue-500'
        }`}
      >
        <GripVertical size={20} />
      </div>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label="Mark task as complete"
      />

      <div
        className={`flex-1 font-medium transition-all ${
          task.completed
            ? `line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`
            : isDarkMode
            ? 'text-gray-200'
            : 'text-gray-800'
        }`}
      >
        {task.text}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className={`transition-colors p-2 rounded-lg ${
          isDarkMode
            ? 'text-gray-500 hover:text-red-400 hover:bg-red-950'
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }`}
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
