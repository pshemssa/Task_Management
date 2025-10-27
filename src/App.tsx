import { useState, useRef, useEffect } from 'react';
import { ListTodo, Sun, Moon } from 'lucide-react';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const tasksCopy = [...tasks];
      const draggedTask = tasksCopy[dragItem.current];

      tasksCopy.splice(dragItem.current, 1);
      tasksCopy.splice(dragOverItem.current, 0, draggedTask);

      setTasks(tasksCopy);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className={`rounded-2xl shadow-xl p-8 border transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <ListTodo size={28} className="text-white" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  My Tasks
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Organize your day, one task at a time
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <TaskInput onAddTask={addTask} isDarkMode={isDarkMode} />

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div
                className={`inline-block p-4 rounded-full mb-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <ListTodo
                  size={48}
                  className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}
                />
              </div>
              <p
                className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                No tasks yet
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                Add your first task to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onDelete={deleteTask}
                  onToggleComplete={toggleComplete}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  isDragging={dragItem.current === index}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div
              className={`mt-6 pt-6 border-t ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <p
                className={`text-center text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total •{' '}
                {tasks.filter((t) => t.completed).length} completed
              </p>
            </div>
          )}
        </div>

        <div
          className={`mt-6 text-center text-sm ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          <p>Drag and drop tasks to reorder them</p>
        </div>
      </div>
    </div>
  );
}

export default App;
