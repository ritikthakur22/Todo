// routes/todoRoutes.js — The ROUTER layer of MVC.
//
// Responsibility: Define which URL + HTTP method maps to which controller.
// This file does NOT contain any logic.
// It just says: "when this request comes in, call this function."
//
// Think of it like a receptionist:
//   "GET /api/todos?      → I'll send you to getTodos"
//   "POST /api/todos?     → I'll send you to createTodo"
//   "PUT /api/todos/:id?  → I'll send you to updateTodo"
//   "DELETE /api/todos/:id? → I'll send you to deleteTodo"

import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

// express.Router() creates a mini Express app just for these routes.
// We'll attach it to '/api/todos' in app.js.
const router = express.Router();

// GET    /api/todos       → get all todos
router.get('/', getTodos);

// POST   /api/todos       → create a new todo
router.post('/', createTodo);

// PUT    /api/todos/:id   → update a specific todo
// :id is a URL parameter — a variable part of the URL
// e.g. /api/todos/abc123 → req.params.id = 'abc123'
router.put('/:id', updateTodo);

// DELETE /api/todos/:id   → delete a specific todo
router.delete('/:id', deleteTodo);

export default router;
