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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const isTrash = req.query.trash === 'true';
    const query = isTrash ? { isDeleted: true } : { isDeleted: { $ne: true } };
    
    const total = await Todo.countDocuments(query);
    const completedCount = await Todo.countDocuments({ ...query, completed: true });
    const pendingCount = total - completedCount;
    const todos = await Todo.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: todos,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      stats: { total, completed: completedCount, pending: pendingCount }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/todos ──────────────────────────────────────────
// Creates a new todo and saves it to MongoDB
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags, attachmentUrl, createdBy, assignedTo, subtasks } = req.body;

    // Validation — don't even try to save if title is missing
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Todo.create() does two things in one step:
    //   1. Creates a new Todo document with the given data
    //   2. Saves it to MongoDB immediately
    // MongoDB auto-generates a unique _id (e.g. "64a1f2b3c4e5f67890abcdef")
    const newTodo = await Todo.create({ title, description, priority, dueDate, category, tags, attachmentUrl, createdBy, assignedTo, subtasks });

    // 201 = Created — something new was made
    if (req.app.get('io')) req.app.get('io').emit('todo_added', newTodo);
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
    const { title, completed, description, priority, dueDate, category, tags, attachmentUrl, createdBy, assignedTo } = req.body;

    // Build an object with only the fields that were sent
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (attachmentUrl !== undefined) updates.attachmentUrl = attachmentUrl;
    if (createdBy !== undefined) updates.createdBy = createdBy;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (req.body.subtasks !== undefined) updates.subtasks = req.body.subtasks;
    if (req.body.order !== undefined) updates.order = req.body.order;

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

    if (req.app.get('io')) req.app.get('io').emit('todo_updated', updatedTodo);
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
    const deletedTodo = await Todo.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
    if (req.app.get('io')) req.app.get('io').emit('todo_deleted', id);
    res.status(200).json({ message: 'Todo soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredTodo = await Todo.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!restoredTodo) return res.status(404).json({ message: 'Todo not found' });
    if (req.app.get('io')) req.app.get('io').emit('todo_restored', id);
    res.status(200).json({ message: 'Todo restored successfully', data: restoredTodo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hardDeleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
    if (req.app.get('io')) req.app.get('io').emit('todo_hard_deleted', id);
    res.status(200).json({ message: 'Todo permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/todos/reorder ────────────────────────────────────
export const reorderTodos = async (req, res) => {
  try {
    const { items } = req.body; // Array of { _id, order }
    
    // Bulk write for performance
    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { order: item.order }
      }
    }));

    await Todo.bulkWrite(bulkOps);
    if (req.app.get('io')) req.app.get('io').emit('todos_reordered');
    res.status(200).json({ message: 'Reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
