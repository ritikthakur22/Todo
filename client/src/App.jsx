// App.jsx — Root component. Now connected to the real Express + MongoDB backend.
//
// KEY NEW CONCEPTS:
//   useEffect → runs side effects (like fetching data) after render
//   loading state → shows a spinner while waiting for the API
//   error state → shows a message if the API request fails

import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import * as todoService from './services/todoService';

function App() {
  // The real todos — will be loaded from MongoDB, not hardcoded
  const [todos, setTodos] = useState([]);

  // loading = true while we're waiting for the API response
  const [loading, setLoading] = useState(true);

  // error = null normally, set to a message if something goes wrong
  const [error, setError] = useState(null);

  // Filter: 'all' | 'pending' | 'completed'
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── useEffect — Load todos when the page first opens ──────
  //
  // useEffect(callback, dependencyArray)
  //
  // The dependency array [] means "run this ONCE when the component
  // first mounts (appears on screen)". This is how we load initial data.
  //
  // Without useEffect, the fetch would run on EVERY re-render
  // (every state change) causing an infinite loop!
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (err) {
        setError('Failed to load todos. Is the server running?');
      } finally {
        // finally runs whether try succeeded or catch ran
        setLoading(false);
      }
    };

    loadTodos();
  }, []); // empty array = run once on mount

  // ── ADD TODO ──────────────────────────────────────────────
  const handleAddTodo = async (title) => {
    try {
      // Send to backend → MongoDB saves it → returns the new todo with _id
      const newTodo = await todoService.createTodo(title);
      // Add the newly created todo (with MongoDB _id) to state
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError(err.message);
    }
  };

  // ── TOGGLE COMPLETE ───────────────────────────────────────
  const handleToggle = async (id) => {
    // Find the current todo to read its completed value
    const todo = todos.find((t) => t._id === id);
    try {
      // Send update to backend → MongoDB updates it
      const updated = await todoService.updateTodo(id, {
        completed: !todo.completed,
      });
      // Replace the old todo with the updated one in state
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── EDIT TITLE ────────────────────────────────────────────
  const handleEdit = async (id, newTitle) => {
    try {
      const updated = await todoService.updateTodo(id, { title: newTitle });
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── DELETE TODO ───────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      // Remove from state using filter
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── FILTER LOGIC ──────────────────────────────────────────
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'pending')   return !todo.completed;
    if (filter === 'completed') return  todo.completed;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.completed).length;

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <button 
          className="theme-toggle" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <h1>📝 Todo List</h1>
        <p>{pendingCount} of {todos.length} task{todos.length !== 1 ? 's' : ''} remaining</p>
      </header>

      <TodoForm onAdd={handleAddTodo} />

      {/* Show error message if something went wrong */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError(null)} className="error-close">✕</button>
        </div>
      )}

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      {/* Show loading spinner while fetching */}
      {loading ? (
        <div className="loading">Loading your todos...</div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;
