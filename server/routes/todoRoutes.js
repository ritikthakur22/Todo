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
//   "DELETE /api/todos/:id? → I'll send you to deleteTodo, restoreTodo, hardDeleteTodo"

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config is automatically picked up from process.env if names match, but we can be explicit:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

import {
  reorderTodos,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo, restoreTodo, hardDeleteTodo,
} from '../controllers/todoController.js';

// express.Router() creates a mini Express app just for these routes.
// We'll attach it to '/api/todos' in app.js.
const router = express.Router();

// POST /api/todos/upload -> Uploads an image to cloudinary
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'todos' },
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ url: result.secure_url });
    }
  );
  uploadStream.end(req.file.buffer);
});


// GET    /api/todos       → get all todos
router.get('/', getTodos);

// POST   /api/todos       → create a new todo
router.post('/', createTodo);
router.put('/reorder', reorderTodos);

// PUT    /api/todos/:id   → update a specific todo
// :id is a URL parameter — a variable part of the URL
// e.g. /api/todos/abc123 → req.params.id = 'abc123'
router.put('/:id', updateTodo);

// DELETE /api/todos/:id   → delete a specific todo
router.delete('/:id', deleteTodo, restoreTodo, hardDeleteTodo);

export default router;

router.patch('/:id/restore', restoreTodo);
router.delete('/:id/hard', hardDeleteTodo);
