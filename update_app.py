import re

with open("client/src/App.jsx", "r") as f:
    app_jsx = f.read()

# 1. Add searchQuery state
if "const [searchQuery, setSearchQuery] = useState('');" not in app_jsx:
    app_jsx = app_jsx.replace(
        "const [filter, setFilter] = useState('all');",
        "const [filter, setFilter] = useState('all');\n  const [searchQuery, setSearchQuery] = useState('');"
    )

# 2. Update filteredTodos logic
old_filter_logic = """const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });"""

new_filter_logic = """const filteredTodos = todos.filter((todo) => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = todo.title.toLowerCase().includes(searchLower) || (todo.description && todo.description.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });"""

app_jsx = app_jsx.replace(old_filter_logic, new_filter_logic)

# 3. Change search div to input
app_jsx = app_jsx.replace(
    '<div className="search-bar">Search tasks...</div>',
    '<input type="text" className="search-bar" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />'
)

# 4. Remove Stats, Categories, Settings from Nav
old_nav = """<div className="nav-center">
          <a href="#" className="nav-item active"><Home size={18} /> Tasks</a>
          <a href="#" className="nav-item"><BarChart2 size={18} /> Stats</a>
          <a href="#" className="nav-item"><Tags size={18} /> Categories</a>
          <a href="#" className="nav-item"><Settings size={18} /> Settings</a>
        </div>"""

new_nav = """<div className="nav-center">
          <a href="#" className="nav-item active"><Home size={18} /> Tasks</a>
        </div>"""

app_jsx = app_jsx.replace(old_nav, new_nav)

with open("client/src/App.jsx", "w") as f:
    f.write(app_jsx)

print("App updated")
