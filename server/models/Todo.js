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
    title: {
      type: String,       // must be text
      required: [true, 'Title is required'],  // cannot be empty
      trim: true,         // automatically removes extra spaces from start/end
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    completed: {
      type: Boolean,
      default: false,     // new todos are NOT completed by default
    },
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
