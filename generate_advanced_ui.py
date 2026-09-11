import os

app_jsx = """
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
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
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
          <a href="#" className="nav-item"><BarChart2 size={18} /> Stats</a>
          <a href="#" className="nav-item"><Tags size={18} /> Categories</a>
          <a href="#" className="nav-item"><Settings size={18} /> Settings</a>
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
          <div className="search-bar">Search tasks...</div>
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
"""

todo_form_jsx = """
import { useState } from 'react';
import { Plus, Flag, Calendar, Tag } from 'lucide-react';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority, category, dueDate });
    setTitle(''); setDescription('');
  };

  return (
    <div className="add-task-container">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-top">
          <input type="text" placeholder="Task title (e.g. Study React)" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <button type="submit" className="btn-add"><Plus size={16} /> Add Task</button>
        </div>
        <textarea placeholder="Add a description (optional)..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        
        <div className="form-options">
          <div className="option-group">
            <label><Flag size={14} /> Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="option-group">
            <label><Calendar size={14} /> Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="option-group">
            <label><Tag size={14} /> Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
export default TodoForm;
"""

todo_item_jsx = """
import { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const getPriorityIcon = (p) => {
    if (p === 'High') return <ArrowUp size={12} color="#ef4444" />;
    if (p === 'Medium') return <ArrowRight size={12} color="#f59e0b" />;
    return <ArrowDown size={12} color="#10b981" />;
  };

  return (
    <div className={`task-row ${todo.completed ? 'completed' : ''}`}>
      <div className="task-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo._id)} />
      </div>
      
      <div className="task-content">
        {isEditing ? (
          <input className="edit-input" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={() => { onEdit(todo._id, { title: editText }); setIsEditing(false); }} autoFocus />
        ) : (
          <div className="task-title">{todo.title}</div>
        )}
        {todo.description && <div className="task-desc">{todo.description}</div>}
        <div className="task-badges">
          {todo.tags && todo.tags.map(t => <span key={t} className="tag-badge">#{t}</span>)}
        </div>
      </div>

      <div className="task-meta">
        <span className={`badge priority-${todo.priority?.toLowerCase()}`}>
          {getPriorityIcon(todo.priority)} {todo.priority}
        </span>
        {todo.dueDate && (
          <span className="badge date">
            <Calendar size={12} /> {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
        <span className="badge category">
          <Tag size={12} /> {todo.category}
        </span>
      </div>

      <div className="task-actions">
        <button className="btn-icon" onClick={() => setIsEditing(!isEditing)}><Edit2 size={16} /></button>
        <button className="btn-icon delete" onClick={() => onDelete(todo._id)}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
export default TodoItem;
"""

css_content = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg-dark: #12141d;
  --bg-card: #1c1e29;
  --bg-card-hover: #232532;
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --border-color: #2d3748;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
}

body.light {
  --bg-dark: #f3f4f6;
  --bg-card: #ffffff;
  --bg-card-hover: #f9fafb;
  --text-main: #111827;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); min-height: 100vh; transition: 0.2s; }

.dashboard { display: flex; flex-direction: column; height: 100vh; }

/* NAV */
.top-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: var(--bg-card); border-bottom: 1px solid var(--border-color); }
.nav-left .logo { display: flex; align-items: center; gap: 0.5rem; font-weight: bold; font-size: 1.2rem; }
.nav-center { display: flex; gap: 2rem; }
.nav-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; }
.nav-item:hover, .nav-item.active { color: var(--primary); }
.nav-right { display: flex; align-items: center; gap: 1.5rem; }
.theme-toggle { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
.user-profile { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; }
.avatar { background: var(--primary); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; }

/* MAIN CONTENT */
.main-content { padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.2rem; }
.page-header p { color: var(--text-muted); }
.date-display { color: var(--text-muted); font-size: 0.9rem; }

/* STATS GRID */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
.stat-icon.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.stat-icon.yellow { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.stat-icon.green { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.stat-info { display: flex; flex-direction: column; flex: 1;}
.stat-label { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.progress-bar-bg { width: 100%; height: 6px; background: var(--border-color); border-radius: 3px; margin-top: 0.5rem; }
.progress-bar-fill { height: 100%; background: var(--success); border-radius: 3px; }

/* ADD FORM */
.add-task-container { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
.add-task-container h3 { margin-bottom: 1rem; font-size: 1.1rem; }
.form-top { display: flex; gap: 1rem; margin-bottom: 1rem; }
.form-top input { flex: 1; background: transparent; border: 1px solid var(--border-color); color: var(--text-main); padding: 0.8rem 1rem; border-radius: 8px; font-size: 1rem; outline: none; }
.form-top input:focus { border-color: var(--primary); }
.btn-add { background: var(--primary); color: white; border: none; padding: 0 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.btn-add:hover { background: var(--primary-hover); }
.add-task-form textarea { width: 100%; background: transparent; border: 1px solid var(--border-color); color: var(--text-main); padding: 0.8rem 1rem; border-radius: 8px; min-height: 60px; margin-bottom: 1rem; outline: none; font-family: inherit;}
.add-task-form textarea:focus { border-color: var(--primary); }
.form-options { display: flex; gap: 2rem; }
.option-group label { display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.4rem; }
.option-group select, .option-group input { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); padding: 0.4rem; border-radius: 6px; outline: none; }

/* FILTERS */
.filters-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.search-bar { background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; color: var(--text-muted); }
.filter-pills { display: flex; gap: 0.5rem; }
.pill { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.pill.active { background: var(--primary); color: white; border-color: var(--primary); }
.pill .badge { background: rgba(255,255,255,0.2); padding: 0.1rem 0.4rem; border-radius: 10px; font-size: 0.75rem; }
.sort-dropdown { display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); font-size: 0.9rem; cursor: pointer; }

/* TASK LIST */
.task-row { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; transition: 0.2s; }
.task-row:hover { background: var(--bg-card-hover); }
.task-row.completed { opacity: 0.6; }
.task-check input { width: 20px; height: 20px; accent-color: var(--primary); cursor: pointer; margin-right: 1rem; }
.task-content { flex: 1; }
.task-title { font-weight: 500; font-size: 1.05rem; margin-bottom: 0.2rem; }
.task-row.completed .task-title { text-decoration: line-through; color: var(--text-muted); }
.task-desc { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.4rem; }
.task-meta { display: flex; gap: 0.8rem; margin-right: 1.5rem; }
.badge { display: flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 500; border: 1px solid var(--border-color); background: transparent; }
.badge.priority-high { color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }
.badge.priority-medium { color: var(--warning); border-color: rgba(245, 158, 11, 0.3); }
.badge.priority-low { color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
.badge.date { color: var(--text-muted); }
.badge.category { color: #a78bfa; border-color: rgba(167, 139, 250, 0.3); }
.task-actions { display: flex; gap: 0.5rem; }
.btn-icon { background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-muted); width: 32px; height: 32px; border-radius: 6px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s; }
.btn-icon:hover { background: var(--border-color); color: var(--text-main); }
.btn-icon.delete:hover { background: rgba(239, 68, 68, 0.1); color: var(--danger); border-color: var(--danger); }
.edit-input { background: transparent; color: white; border: 1px solid var(--primary); padding: 0.4rem; border-radius: 4px; font-size: 1rem;}
"""

with open('client/src/App.jsx', 'w') as f: f.write(app_jsx)
with open('client/src/components/TodoForm.jsx', 'w') as f: f.write(todo_form_jsx)
with open('client/src/components/TodoItem.jsx', 'w') as f: f.write(todo_item_jsx)
with open('client/src/index.css', 'w') as f: f.write(css_content)

print("Advanced UI created successfully.")
