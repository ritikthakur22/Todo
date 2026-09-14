
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Home, BarChart2, Moon, Sun, CheckSquare } from 'lucide-react';
import { useTodos, useAddTodo, useUpdateTodo, useDeleteTodo, useReorderTodos } from './hooks/todo.hook';
import { useQueryClient } from '@tanstack/react-query';
import TodoForm from './components/TodoForm';
import ConfirmModal from './components/ConfirmModal';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('tasks');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [deleteId, setDeleteId] = useState(null);

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


  // ── Infinite Query ──────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTodos(10);
  const { mutateAsync: addTodo } = useAddTodo();
  const { mutateAsync: updateTodoReq } = useUpdateTodo();
  const { mutateAsync: deleteTodoReq } = useDeleteTodo();
  const { mutateAsync: reorderTodosReq } = useReorderTodos();

  // Flatten all fetched pages into one array

  const observer = useRef();
  const lastTodoElementRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const todos = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.data),
    [data]
  );

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
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTodoReq(deleteId);
    } catch (err) { setMutationError(err.message); }
    setDeleteId(null);
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

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = todo.title.toLowerCase().includes(searchLower) || (todo.description && todo.description.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  const globalStats = data?.pages?.[0]?.stats || { total: 0, pending: 0, completed: 0 };
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
              <div className="filter-pills">
                <button className={`pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span className="badge">{totalCount}</span></button>
                <button className={`pill ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active <span className="badge">{pendingCount}</span></button>
                <button className={`pill ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed <span className="badge">{completedCount}</span></button>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            {isLoading ? <div className="loading">Loading...</div> :
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
              </DndContext>
            }

            {/* ── Auto Load More Trigger ───────────────────────────────── */}
            <div ref={lastTodoElementRef} style={{ height: '20px', margin: '10px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              {isFetchingNextPage && 'Loading more tasks...'}
            </div>
          </>
        ) : (
          <StatsDashboard todos={todos} />
        )}

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
      />
      </main>
    </div>
  );
}
export default App;
