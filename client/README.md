# Frontend Guide

## ⚛️ React Concepts Learned

### 1. Component
A function that returns JSX (HTML-like code):
```jsx
function TodoForm() {
  return <form>...</form>;
}
```

### 2. JSX Rules
```jsx
// Use className instead of class
<div className="app">

// Close all tags
<input type="text" />

// One root element (or Fragment <>)
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);

// JavaScript inside curly braces
<p>{todo.title}</p>
<p>{2 + 2}</p>
<p>{isLoading ? "Loading..." : "Done!"}</p>
```

### 3. Props
```jsx
// Parent passes data down
<TodoItem todo={todo} onDelete={handleDelete} />

// Child receives it
function TodoItem({ todo, onDelete }) {
  return <p>{todo.title}</p>;
}
```

### 4. useState
```jsx
const [todos, setTodos] = useState([]);   // array
const [loading, setLoading] = useState(true); // boolean
const [title, setTitle] = useState('');   // string

// NEVER modify state directly:
todos.push(newTodo);    // ❌ React won't re-render

// ALWAYS use the setter:
setTodos([...todos, newTodo]);  // ✅ React re-renders
```

### 5. useEffect
```jsx
// Runs ONCE when component mounts (appears on screen)
useEffect(() => {
  fetchTodos();
}, []); // [] = empty dependency array = run once

// Runs when 'filter' changes
useEffect(() => {
  applyFilter();
}, [filter]);
```

### 6. Controlled Input
```jsx
const [title, setTitle] = useState('');

<input
  value={title}                          // React controls the value
  onChange={(e) => setTitle(e.target.value)}  // update state on keypress
/>
```

### 7. Lifting State Up
When two components need the same data, put state in their common parent:
```
App (owns todos state)
 ├── TodoForm (needs to ADD to todos)
 └── TodoList (needs to DISPLAY todos)
```

### 8. Immutability
Never mutate state directly. Always create new values:
```js
// Adding:     [...oldArray, newItem]
// Removing:   oldArray.filter(item => item.id !== id)
// Updating:   oldArray.map(item => item.id === id ? {...item, ...changes} : item)
```

---

## 📖 JavaScript Concepts Used

### Destructuring
```js
// Object destructuring
const { title, completed } = todo;

// Array destructuring  
const [todos, setTodos] = useState([]);

// Function parameter destructuring
function TodoItem({ todo, onDelete }) { ... }
```

### Spread Operator
```js
// Copy an object and override one field
const updated = { ...todo, completed: true };

// Copy an array and add an item
const newTodos = [...todos, newTodo];
```

### Arrow Functions
```js
const handleDelete = (id) => {
  setTodos(todos.filter(t => t._id !== id));
};
```

### Array Methods
```js
todos.map(todo => <TodoItem key={todo._id} todo={todo} />)
todos.filter(todo => !todo.completed)
todos.find(todo => todo._id === id)
```

### Template Literals
```js
const url = `http://localhost:5000/api/todos/${id}`;
console.log(`Server running on port ${PORT}`);
```

### async / await
```js
const getTodos = async () => {
  try {
    const response = await fetch('/api/todos');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};
```

### Modules (import / export)
```js
// Named export
export const getTodos = async () => { ... };
export const createTodo = async () => { ... };

// Default export
export default App;

// Importing
import App from './App';
import { getTodos, createTodo } from './services/todoService';
import * as todoService from './services/todoService';
```

---

### Frontend Files

#### `client/index.html`
The only HTML file. Has `<div id="root">` where React renders everything.
Never directly modified when building React apps.

#### `client/src/main.jsx`
React's entry point. Finds `<div id="root">` and renders `<App />` inside it.

#### `client/src/App.jsx`
Root component. Owns all shared state (todos, filter, loading, error).
Imports and arranges all other components. Contains all handler functions.

#### `client/src/components/TodoForm.jsx`
Input box + Add button. Has its own `title` state (controlled input).
Calls `onAdd(title)` prop when submitted.

#### `client/src/components/TodoList.jsx`
Receives todos array as prop. Renders a `TodoItem` for each.
Shows empty state message when list is empty.

#### `client/src/components/TodoItem.jsx`
Displays one todo. Has its own `isEditing` and `editText` local state.
Calls `onToggle`, `onEdit`, `onDelete` props to inform parent.

#### `client/src/components/TodoFilter.jsx`
Three filter buttons (All/Pending/Completed). Stateless — just calls `onFilterChange` when clicked.

#### `client/src/services/todoService.js`
All `fetch()` calls live here. Components import functions from here.
Centralises API URL and request logic.

---

