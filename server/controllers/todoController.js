// controllers/todoController.js — The CONTROLLER layer of MVC.
//
// NOW USING MONGODB via Mongoose instead of the in-memory array.
// Every function is async because database operations take time
// (they go over the network to MongoDB Atlas).
//
// We use try/catch on every operation because anything can fail:
//   - network issues
//   - invalid data
//   - MongoDB being temporarily unavailable
//
// Mongoose methods used here:
//   Todo.find()              → get all documents from 'todos' collection
//   Todo.create()            → create and save a new document
//   Todo.findByIdAndUpdate() → find by _id, update fields, return updated doc
//   Todo.findByIdAndDelete() → find by _id and remove it

import Todo from '../models/Todo.js';

// ── GET /api/todos ───────────────────────────────────────────
// Returns all todos, newest first
export const getTodos = async (req, res) => {
  try {
    // Todo.find({}) → get ALL documents (empty filter = no conditions)
    // .sort({ createdAt: -1 }) → newest first (-1 = descending)
    const todos = await Todo.find({}).sort({ createdAt: -1 });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/todos ──────────────────────────────────────────
// Creates a new todo and saves it to MongoDB
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;

    // Validation — don't even try to save if title is missing
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Todo.create() does two things in one step:
    //   1. Creates a new Todo document with the given data
    //   2. Saves it to MongoDB immediately
    // MongoDB auto-generates a unique _id (e.g. "64a1f2b3c4e5f67890abcdef")
    const newTodo = await Todo.create({ title, description, priority, dueDate, category, tags });

    // 201 = Created — something new was made
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/todos/:id ───────────────────────────────────────
// Updates a todo's title and/or completed status
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, description, priority, dueDate, category, tags } = req.body;

    // Build an object with only the fields that were sent
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;

    // findByIdAndUpdate(id, updates, options):
    //   id      → MongoDB's _id field (automatically searches by _id)
    //   updates → the fields to change
    //   { new: true } → return the UPDATED document (not the old one)
    //   { runValidators: true } → run schema validation on the update too
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE /api/todos/:id ────────────────────────────────────
// Permanently removes a todo from MongoDB
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
