// TodoList.jsx — Renders the full list of todos.
//
// It receives handler functions as props from App
// and passes them further DOWN to each TodoItem.
// TodoList itself doesn't USE these functions —
// it just acts as a "pass-through" to deliver them to TodoItem.
// This is normal in React and is called "prop drilling".

import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet! Add one above ☝️</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          // Pass the handlers further down to each TodoItem.
          // TodoItem will call these when buttons are clicked.
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TodoList;
