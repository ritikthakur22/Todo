// services/todoService.js — The API communication layer.
//
// WHY a separate service file?
// Without it, every component would have fetch() calls scattered everywhere.
// If the API URL changes, you'd need to update 10 files.
// With this file: change it in ONE place.
//
// Components call these functions, they DON'T call fetch() directly.
// This separation makes the code cleaner and easier to maintain.
//
// Data flow:
//   React component → calls todoService function → fetch() → Express → MongoDB

// The base URL of our Express backend.
// All API requests go to this address.
const API_URL = 'http://localhost:5000/api/todos';

// ── Get All Todos ─────────────────────────────────────────────
export const getTodos = async () => {
  // fetch() sends an HTTP request. Default method is GET.
  const response = await fetch(API_URL);

  // response.ok is true if status code is 200-299
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  // response.json() reads the response body and parses it as JSON.
  // This gives us a JavaScript array of todo objects.
  return response.json();
};

// ── Create a Todo ─────────────────────────────────────────────
export const createTodo = async (title) => {
  const response = await fetch(API_URL, {
    method: 'POST',           // we're CREATING data → POST

    headers: {
      // Tell the server we're sending JSON data in the body.
      // Without this, Express won't know how to parse req.body.
      'Content-Type': 'application/json',
    },

    // JSON.stringify() converts a JavaScript object to a JSON string.
    // The server will receive: '{"title":"Learn React"}'
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create todo');
  }

  return response.json();
};

// ── Update a Todo ─────────────────────────────────────────────
export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update todo');
  }

  return response.json();
};

// ── Delete a Todo ─────────────────────────────────────────────
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }

  return response.json();
};
