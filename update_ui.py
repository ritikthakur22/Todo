import re

# 1. UPDATE index.css
with open("client/src/index.css", "r") as f:
    css = f.read()

new_css = """/* index.css — Global styles for the entire Todo app */
:root {
  --bg-color: #f0f2f5;
  --text-color: #333;
  --card-bg: white;
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --border-color: #ddd;
  --header-text: #2c3e50;
  --sub-text: #7f8c8d;
  --btn-bg: #ecf0f1;
  --btn-hover: #bdc3c7;
  --btn-text: #555;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body.dark {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --card-bg: #1e1e1e;
  --primary-color: #bb86fc;
  --primary-hover: #9965f4;
  --border-color: #333;
  --header-text: #ffffff;
  --sub-text: #aaaaaa;
  --btn-bg: #2c2c2c;
  --btn-hover: #3d3d3d;
  --btn-text: #e0e0e0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
}

/* Header */
.app-header {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.app-header h1 {
  font-size: 2.5rem;
  color: var(--header-text);
  margin-bottom: 0.3rem;
  transition: color 0.3s ease;
}

.app-header p {
  color: var(--sub-text);
  font-size: 1rem;
}

/* Theme Toggle */
.theme-toggle {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  transform: scale(1.1);
}

/* Form */
.todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
}
.todo-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
body.dark .todo-input:focus {
  box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.2);
}

/* Buttons */
.btn {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn:hover { transform: translateY(-2px); }

.btn-add { background-color: var(--primary-color); color: white; border-radius: 12px; }
.btn-add:hover { background-color: var(--primary-hover); }

.btn-edit { background-color: var(--btn-bg); color: var(--btn-text); padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.btn-edit:hover { background-color: var(--btn-hover); }

.btn-delete { background-color: #e74c3c; color: white; padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.btn-delete:hover { background-color: #c0392b; }

.btn-save { background-color: #2ecc71; color: white; padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.btn-save:hover { background-color: #27ae60; }

.btn-cancel { background-color: var(--btn-bg); color: var(--btn-text); padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.btn-cancel:hover { background-color: var(--btn-hover); }

/* Todo List */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--card-bg);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease forwards;
}
.todo-item:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.todo-item.completed {
  opacity: 0.7;
  background: var(--bg-color);
}

.todo-checkbox {
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.todo-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.todo-title {
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.3s;
}
.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--sub-text);
}

.todo-timestamp {
  font-size: 0.75rem;
  color: var(--sub-text);
  margin-top: 0.2rem;
}

.todo-actions { display: flex; gap: 0.5rem; }

.todo-edit-input {
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
  border: 2px solid var(--primary-color);
  border-radius: 6px;
  outline: none;
}

/* Filters */
.todo-filter { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; justify-content: center; }
.btn-filter {
  background-color: var(--btn-bg);
  color: var(--btn-text);
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 20px;
  border: 1px solid transparent;
}
.btn-filter:hover { background-color: var(--btn-hover); }
.btn-filter.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(52,152,219,0.4);
}
body.dark .btn-filter.active { box-shadow: 0 2px 8px rgba(187,134,252,0.4); }

.loading, .empty-state { text-align: center; padding: 3rem; color: var(--sub-text); font-size: 1.1rem; }
.loading { animation: pulse 1.5s infinite; color: var(--primary-color); }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.error-banner {
  display: flex; justify-content: space-between; align-items: center;
  background-color: #fdecea; border: 1px solid #e74c3c; color: #c0392b;
  padding: 1rem; border-radius: 12px; margin-bottom: 1rem;
}
body.dark .error-banner { background-color: #4a1915; color: #ff8a80; border-color: #ff5252; }
.error-close { background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; }
"""

with open("client/src/index.css", "w") as f:
    f.write(new_css)


# 2. UPDATE App.jsx
with open("client/src/App.jsx", "r") as f:
    app_jsx = f.read()

# Add theme logic to App.jsx
if "const [theme, setTheme]" not in app_jsx:
    # insert useState for theme
    app_jsx = app_jsx.replace(
        "const [filter, setFilter] = useState('all');",
        "const [filter, setFilter] = useState('all');\n  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');\n\n  useEffect(() => {\n    document.body.className = theme;\n    localStorage.setItem('theme', theme);\n  }, [theme]);"
    )
    
    # insert theme toggle button in header
    app_jsx = app_jsx.replace(
        "<header className=\"app-header\">",
        "<header className=\"app-header\">\n        <button \n          className=\"theme-toggle\" \n          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}\n          title=\"Toggle Theme\"\n        >\n          {theme === 'light' ? '🌙' : '☀️'}\n        </button>"
    )

with open("client/src/App.jsx", "w") as f:
    f.write(app_jsx)


# 3. UPDATE TodoItem.jsx
with open("client/src/components/TodoItem.jsx", "r") as f:
    item_jsx = f.read()

# Replace view mode with one that includes a timestamp
view_mode_old = """<span className="todo-title">{todo.title}</span>"""
view_mode_new = """<div className="todo-content">
          <span className="todo-title">{todo.title}</span>
          <span className="todo-timestamp">
            {todo.createdAt ? new Date(todo.createdAt).toLocaleString() : 'Just now'}
          </span>
        </div>"""

if view_mode_old in item_jsx:
    item_jsx = item_jsx.replace(view_mode_old, view_mode_new)

with open("client/src/components/TodoItem.jsx", "w") as f:
    f.write(item_jsx)

print("UI updated successfully")
