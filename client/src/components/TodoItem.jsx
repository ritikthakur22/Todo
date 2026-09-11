// TodoItem.jsx — Displays ONE todo. Also handles inline editing.
//
// This component has its OWN local state (isEditing, editText).
// Why local and not in App?
// Because "is THIS item being edited right now?" only matters to THIS item.
// App doesn't need to know about it. Keep state as close as possible
// to where it's used — that's good React design.

import { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  // Local state: are we currently in edit mode for this item?
  const [isEditing, setIsEditing] = useState(false);

  // Local state: the temporary text while editing
  // Starts as the current title so the input is pre-filled
  const [editText, setEditText] = useState(todo.title);

  // Called when the user clicks Save (or presses Enter)
  const handleSave = () => {
    // Don't save if the field is blank
    if (editText.trim() === '') return;

    // Call onEdit (from App) to update the real data in state
    onEdit(todo._id, editText.trim());

    // Exit edit mode
    setIsEditing(false);
  };

  // Called when the user presses a key while editing
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();      // Enter → save
    if (e.key === 'Escape') {
      // Escape → cancel: reset text and exit edit mode
      setEditText(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>

      <input
        type="checkbox"
        checked={todo.completed}
        className="todo-checkbox"
        onChange={() => onToggle(todo._id)}
      />

      {/* --- Conditional Rendering: show input OR text depending on mode --- */}
      {isEditing ? (
        // EDIT MODE: show an input box with the current title
        <input
          type="text"
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          // autoFocus automatically puts the cursor in this input
          // when it appears — better UX
          autoFocus
        />
      ) : (
        // VIEW MODE: show the title as text
        <span className="todo-title">{todo.title}</span>
      )}

      <div className="todo-actions">
        {isEditing ? (
          // In edit mode: show Save and Cancel buttons
          <>
            <button className="btn btn-save" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => {
                setEditText(todo.title); // reset text
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          // In view mode: show Edit and Delete buttons
          <>
            <button
              className="btn btn-edit"
              // Don't allow editing a completed todo
              disabled={todo.completed}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(todo._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
