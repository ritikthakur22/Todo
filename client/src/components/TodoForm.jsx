// TodoForm.jsx — Handles the input and submission for adding a new todo.
//
// KEY CONCEPT: Controlled Input
// In a "controlled" input, React STATE is the single source of truth.
// Every keystroke updates state → state feeds back into the input's value.
// This gives React full control over the input at all times.
//
// Data flow of a controlled input:
//   User types a character
//       ↓
//   onChange fires
//       ↓
//   setTitle(newValue) updates state
//       ↓
//   React re-renders with new state
//       ↓
//   Input shows updated value

// Import the useState hook from React.
// Hooks are special functions that give components extra powers.
import { useState } from 'react';

// TodoForm receives "onAdd" as a prop — this is a FUNCTION passed from App.
// When the user submits, we call onAdd(title) to tell the parent
// "hey, the user wants to add this todo!"
// This pattern is called "lifting state up" — the parent owns the todos,
// so the parent must be the one to add to it.
function TodoForm({ onAdd }) {
  // State for the current text in the input box.
  // Starts as an empty string (no text typed yet).
  const [title, setTitle] = useState('');

  // This function runs when the form is submitted
  // (either by clicking "Add" or pressing Enter)
  const handleSubmit = (event) => {
    // Prevent the browser's default form behaviour (which would reload the page).
    // In React, we handle form submission ourselves.
    event.preventDefault();

    // Trim removes extra spaces from start and end.
    // Don't add a todo if the input is empty or just spaces.
    if (title.trim() === '') return;

    // Call the onAdd function that was passed from App.jsx
    // and send the typed title up to the parent.
    onAdd(title.trim());

    // Clear the input after adding
    setTitle('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        className="todo-input"
        // "value" makes this a CONTROLLED input.
        // The input always shows exactly what React's state says.
        value={title}
        // Every keystroke fires onChange.
        // e.target.value is the current text in the input box.
        // We store it in state so React tracks it.
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="btn btn-add">
        Add
      </button>
    </form>
  );
}

export default TodoForm;
