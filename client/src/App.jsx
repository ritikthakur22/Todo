
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Home, BarChart2, Moon, Sun, CheckSquare } from 'lucide-react';
import { useTodos, useAddTodo, useUpdateTodo, useDeleteTodo, useReorderTodos } from './hooks/todo.hook';
import { useQueryClient } from '@tanstack/react-query';
import TodoForm from './components/TodoForm';
import ConfirmModal from './components/ConfirmModal';
import TaskDetailModal from './components/TaskDetailModal';
import TrashModal from './components/TrashModal';
import TodoList from './components/TodoList';
import StatsDashboard from './components/StatsDashboard';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import NepaliDate from 'nepali-date-converter';
import { io } from 'socket.io-client';
import './index.css';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';
const socket = io(API_URL.replace('/api/todos', ''));

function App() {
  const [mutationError, setMutationError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('tasks');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [deleteId, setDeleteId] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showTrash, setShowTrash] = useState(false);

  // Keyboard shortcut listener: Alt + R + T to toggle Trash
  useEffect(() => {
    let keyBuffer = [];
    const handleKeyDown = (e) => {
      if (!e.altKey) {
        keyBuffer = [];
        return;
      }
      
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > 2) keyBuffer.shift();
      
      if (keyBuffer.join('') === 'rt') {
        setShowTrash(prev => !prev);
        keyBuffer = []; // reset after trigger
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAdd = (todo) => {
      // Small delay to ensure our own optimistic updates finish first
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["todos"] }), 100);
    };
    
    socket.on('todo_added', handleAdd);
    socket.on('todo_updated', handleAdd);
    socket.on('todo_deleted', handleAdd);
    socket.on('todos_reordered', handleAdd);

    return () => {
      socket.off('todo_added', handleAdd);
      socket.off('todo_updated', handleAdd);
      socket.off('todo_deleted', handleAdd);
      socket.off('todos_reordered', handleAdd);
    };
  }, [queryClient]);


  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useTodos(page, 10);
  const { mutateAsync: addTodo } = useAddTodo();
  const { mutateAsync: updateTodoReq } = useUpdateTodo();
  const { mutateAsync: deleteTodoReq } = useDeleteTodo();
  const { mutateAsync: reorderTodosReq } = useReorderTodos();

  // Flatten all fetched pages into one array



  const todos = useMemo(
    () => data?.data ?? [],
    [data]
  );
  
  const totalPages = data?.pagination?.pages || 1;


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAdd = async (todoData) => {
    try {
      await addTodo({ ...todoData, order: todos.length });
      // Refetch first page — React Query will revalidate automatically
    } catch (err) { setMutationError(err.message); }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      await updateTodoReq({ id, data: { completed: !todo.completed } });
    } catch (err) { setMutationError(err.message); }
  };

  const handleEdit = async (id, data) => {
    try {
      await updateTodoReq({ id, data });
    } catch (err) { setMutationError(err.message); }
  };

  const handleDelete = (id) => {
    if (id.toString().startsWith('temp-')) {
      setMutationError("Wait a second! This task is still saving to the cloud.");
      return;
    }
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setDeleteId(null); // Close modal instantly
    try {
      await deleteTodoReq(idToDelete); // Delete in background
    } catch (err) { setMutationError(err.message); }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update backend order
        const reorderData = newItems.map((item, index) => ({ _id: item._id, order: index }));
        reorderTodosReq(reorderData).catch(console.error);
        return newItems;
      });
    }
  };

  const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const filteredTodos = [...todos].filter((todo) => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = todo.title.toLowerCase().includes(searchLower) || (todo.description && todo.description.toLowerCase().includes(searchLower)) || (todo.createdBy && todo.createdBy.toLowerCase().includes(searchLower)) || (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'default') return 0;
    const aMatch = a.priority?.toLowerCase() === sortBy;
    const bMatch = b.priority?.toLowerCase() === sortBy;
    if (aMatch && !bMatch) return -1;
    if (bMatch && !aMatch) return 1;
    return 0;
  });

  const globalStats = data?.stats || { total: 0, pending: 0, completed: 0 };
  const totalCount = globalStats.total;
  const pendingCount = globalStats.pending;
  const completedCount = globalStats.completed;
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const error = mutationError || (isError ? queryError?.message : null);

  return (
    <div className="dashboard">
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo"><CheckSquare fill="#3b82f6" color="white" size={28} /> <span>Todo App</span></div>
        </div>
        <div className="nav-center">
          <a href="#" className={`nav-item ${currentTab === 'tasks' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('tasks'); }}><Home size={18} /> Tasks</a>
          <a href="#" className={`nav-item ${currentTab === 'stats' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('stats'); }}><BarChart2 size={18} /> Stats</a>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentTab === 'tasks' ? (
          <>
            <header className="page-header">
              <div>
                <h1>My Tasks</h1>
                <p>Stay organized and get things done. 💪</p>
              </div>
              <div className="date-display" style={{ textAlign: 'right' }}>
                <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {new NepaliDate().format('ddd, MMMM D, YYYY')} (BS)
                </div>
              </div>
            </header>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><CheckSquare size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">{totalCount}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon yellow"><BarChart2 size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{pendingCount}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><CheckSquare size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{completedCount}</span>
                </div>
              </div>
              <div className="stat-card completion-card">
                <div className="stat-info">
                  <span className="stat-label">Completion Rate</span>
                  <span className="stat-value">{completionRate}%</span>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div></div>
                </div>
              </div>
            </div>

            <TodoForm onAdd={handleAdd} />

            <div className="filters-row">
              <input type="text" className="search-bar" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="filter-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <button className={`pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span className="badge">{totalCount}</span></button>
                <button className={`pill ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active <span className="badge">{pendingCount}</span></button>
                <button className={`pill ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed <span className="badge">{completedCount}</span></button>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="default">Sort: Default</option>
                  <option value="high">High Priority First</option>
                  <option value="medium">Medium Priority First</option>
                  <option value="low">Low Priority First</option>
                </select>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            {isLoading ? <div className="loading">Loading...</div> :
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onClickTodo={(todo) => setSelectedTodo(todo)} />
              </DndContext>
            }

            {/* ── Pagination Controls ───────────────────────────────── */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  Page 
                  <select 
                    value={page} 
                    onChange={(e) => setPage(Number(e.target.value))}
                    style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.2rem 0.5rem' }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  of {totalPages}
                </span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <StatsDashboard todos={todos} />
        )}

            <TaskDetailModal 
        isOpen={!!selectedTodo}
        onClose={() => setSelectedTodo(null)}
        todo={selectedTodo}
      />
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? It will be moved to the Trash."
      />
      <TrashModal isOpen={showTrash} onClose={() => setShowTrash(false)} /></main>
    </div>
  );
}
export default App;
