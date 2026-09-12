
import { useState, useEffect, useMemo } from 'react';
import { Home, BarChart2, Moon, Sun, CheckSquare } from 'lucide-react';
import { useTodos, useAddTodo, useUpdateTodo, useDeleteTodo, useReorderTodos } from './hooks/todo.hook';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import StatsDashboard from './components/StatsDashboard';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './index.css';

function App() {
  const [localTodos, setLocalTodos] = useState(null); // null = use server data
  const [mutationError, setMutationError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('tasks');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

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

  // Flatten all fetched pages into one array
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

  const handleDelete = async (id) => {
    try {
      await deleteTodoReq(id);
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

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = todo.title.toLowerCase().includes(searchLower) || (todo.description && todo.description.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const completionRate = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

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
              <div className="date-display">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </header>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><CheckSquare size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">{todos.length}</span>
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
                <button className={`pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span className="badge">{todos.length}</span></button>
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

            {/* ── Load More ───────────────────────────────── */}
            {hasNextPage && (
              <div className="pagination" style={{ justifyContent: 'center' }}>
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  style={{ minWidth: '140px' }}
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <StatsDashboard todos={todos} />
        )}
      </main>
    </div>
  );
}
export default App;
