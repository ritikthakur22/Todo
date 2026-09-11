
import { useState, useEffect } from 'react';
import { Home, BarChart2, Tags, Settings, Moon, Sun, CheckSquare, ChevronDown } from 'lucide-react';
import todoService from './services/todoService';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (err) {
        setError('Failed to load todos.');
      } finally { setLoading(false); }
    };
    loadTodos();
  }, []);

  const handleAdd = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos([newTodo, ...todos]);
    } catch (err) { setError(err.message); }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const updated = await todoService.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) { setError(err.message); }
  };

  const handleEdit = async (id, data) => {
    try {
      const updated = await todoService.updateTodo(id, data);
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) { setError(err.message); }
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

  return (
    <div className="dashboard">
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo"><CheckSquare fill="#3b82f6" color="white" size={28} /> <span>Todo App</span></div>
        </div>
        <div className="nav-center">
          <a href="#" className="nav-item active"><Home size={18} /> Tasks</a>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="user-profile">
            <div className="avatar">R</div>
            <span>Ritik Thakur</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </nav>

      <main className="main-content">
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
          <div className="sort-dropdown">Sort by: Newest <ChevronDown size={14} /></div>
        </div>

        {error && <div className="error">{error}</div>}
        
        {loading ? <div className="loading">Loading...</div> : 
          <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
        }
      </main>
    </div>
  );
}
export default App;
