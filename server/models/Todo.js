// models/Todo.js — The MODEL layer of MVC.
//
// Responsibility: Define the shape (Schema) of a Todo document in MongoDB
// and provide an interface (Model) to interact with the database.
//
// KEY CONCEPTS:
//
// Schema → Blueprint. Defines what fields a Todo has and their rules.
// Model  → The actual class you use to create, read, update, delete documents.
// Document → One single record in MongoDB (like one row in SQL).
// Collection → All todo documents together (like a table in SQL).

import mongoose from 'mongoose';

// --- Schema Definition ---
// Schema says: "Every todo document MUST look like this"
const todoSchema = new mongoose.Schema(
  {
    
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date, default: null },
    category: { type: String, default: 'Personal' },
    tags: { type: [String], default: [] },
    
    completed: { type: Boolean, default: false },
    subtasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    order: { type: Number, default: 0 },
    attachmentUrl: { type: String, default: '' },
    createdBy: { type: String, default: 'Ritik' },
    assignedTo: { type: String, default: 'Myself' },


  },

  {
    // timestamps: true automatically adds TWO fields to every document:
    //   createdAt → when the todo was first created
    //   updatedAt → when the todo was last changed
    // Mongoose manages these automatically — you never set them manually.
    timestamps: true,
  }
);

// --- Create the Model ---
// mongoose.model('Todo', todoSchema) does two things:
//   1. Creates a class called Todo with methods like:
//      Todo.find(), Todo.create(), Todo.findByIdAndUpdate(), etc.
//   2. Links it to a MongoDB collection named 'todos'
//      (Mongoose auto-pluralizes 'Todo' → 'todos' collection)
const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
