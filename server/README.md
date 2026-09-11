# Backend Guide

## 🔄 The Request Flow

This is the most important diagram in the entire project.
**Understand this and you understand full-stack development.**

### Example: User adds a new todo "Buy milk"

```
1. User types "Buy milk" → clicks Add button
           ↓
2. TodoForm calls onAdd("Buy milk")
           ↓
3. handleAddTodo() in App.jsx runs
           ↓
4. todoService.createTodo("Buy milk") is called
           ↓
5. fetch("http://localhost:5000/api/todos", {
     method: "POST",
     body: JSON.stringify({ title: "Buy milk" })
   })
           ↓  HTTP goes over the network
6. Express receives the POST /api/todos request
           ↓
7. todoRoutes.js matches: router.post("/", createTodo)
           ↓
8. todoController.js: createTodo() function runs
     → reads req.body.title = "Buy milk"
     → calls Todo.create({ title: "Buy milk" })
           ↓
9. Mongoose translates to MongoDB command
           ↓
10. MongoDB Atlas saves the document:
    {
      _id: "64f3a2b...",
      title: "Buy milk",
      completed: false,
      createdAt: "2024-...",
      updatedAt: "2024-..."
    }
           ↓
11. MongoDB returns the saved document to Mongoose
           ↓
12. Controller sends: res.status(201).json(newTodo)
           ↓  HTTP response goes back
13. fetch() in todoService resolves with the new todo
           ↓
14. App.jsx: setTodos([newTodo, ...todos])
           ↓
15. React detects state change → re-renders
           ↓
16. User sees "Buy milk" appear in the list ✅
```

---

## 🏛 MVC Explained

MVC = **Model, View, Controller** — a way to organize backend code
so each file has exactly ONE responsibility.

```
┌────────────────────────────────────────────────────────┐
│                     BACKEND                            │
│                                                        │
│  ROUTE             CONTROLLER           MODEL          │
│  ─────────         ────────────         ──────────     │
│  todoRoutes.js     todoController.js    Todo.js        │
│                                                        │
│  "Which URL?"      "What logic?"        "Database?"    │
│                                                        │
│  GET /api/todos → getTodos()        →   Todo.find()    │
│  POST /api/todos → createTodo()     →   Todo.create()  │
│  PUT /:id       → updateTodo()      →   Todo.findById  │
│  DELETE /:id    → deleteTodo()      →   Todo.findById  │
│                                         AndDelete()    │
└────────────────────────────────────────────────────────┘
```

### Why MVC?

**Without MVC (bad):**
```js
// Everything crammed into one route — hard to read, hard to maintain
app.post('/api/todos', async (req, res) => {
  // validation here
  // database logic here  
  // error handling here
  // business logic here
  // ... 100 lines in one place 😱
})
```

**With MVC (good):**
```
Route     → just says "POST / → call createTodo"    (5 lines)
Controller → handles validation + logic              (30 lines)
Model      → handles database shape + operations     (20 lines)
```

Each file is small, focused, and easy to understand.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| GET | `/api/todos` | Get all todos | None |
| POST | `/api/todos` | Create a new todo | `{ "title": "string" }` |
| PUT | `/api/todos/:id` | Update a todo | `{ "title": "string", "completed": boolean }` |
| DELETE | `/api/todos/:id` | Delete a todo | None |

### Examples

**GET all todos:**
```
GET http://localhost:5000/api/todos

Response 200:
[
  {
    "_id": "64f3a2b1c9e4d5f6a7b8c9d0",
    "title": "Learn React",
    "completed": false,
    "createdAt": "2024-09-11T12:00:00.000Z",
    "updatedAt": "2024-09-11T12:00:00.000Z"
  }
]
```

**POST create todo:**
```
POST http://localhost:5000/api/todos
Content-Type: application/json

Body:
{ "title": "Buy groceries" }

Response 201:
{
  "_id": "64f3a2b1c9e4d5f6a7b8c9d1",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2024-09-11T12:05:00.000Z",
  "updatedAt": "2024-09-11T12:05:00.000Z"
}
```

**PUT update todo:**
```
PUT http://localhost:5000/api/todos/64f3a2b1c9e4d5f6a7b8c9d1
Content-Type: application/json

Body:
{ "completed": true }

Response 200:
{
  "_id": "64f3a2b1c9e4d5f6a7b8c9d1",
  "title": "Buy groceries",
  "completed": true,
  ...
}
```

**DELETE todo:**
```
DELETE http://localhost:5000/api/todos/64f3a2b1c9e4d5f6a7b8c9d1

Response 200:
{ "message": "Todo deleted successfully" }
```

### HTTP Status Codes Used

| Code | Meaning | When we use it |
|---|---|---|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (new resource made) |
| 400 | Bad Request | Missing required fields (e.g. no title) |
| 404 | Not Found | Todo with that ID doesn't exist |
| 500 | Server Error | Unexpected crash or DB error |

---

## 🟢 Node.js & Express Concepts

### What Node.js Is
- JavaScript runtime that works OUTSIDE the browser
- Lets you use JavaScript for backend/server code
- Single-threaded but non-blocking (handles many requests via async)

### Express Request Object (`req`)
```js
req.body        // Data sent in the request body (POST/PUT)
req.params.id   // URL parameters  e.g. /todos/:id → req.params.id
req.query.filter // Query string   e.g. /todos?filter=pending
req.headers     // HTTP headers
```

### Express Response Object (`res`)
```js
res.status(200).json(data)     // Send JSON with status code
res.status(201).json(newItem)  // Created
res.status(404).json({ message: 'Not found' })
res.status(500).json({ message: error.message })
```

### Middleware
```js
// Runs on EVERY request, in order
app.use(cors());           // Allow cross-origin requests
app.use(express.json());   // Parse request body as JSON

// Custom middleware example:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // MUST call next() to continue to the route
});
```

### CORS — Why It Exists
```
React:   http://localhost:5173
Express: http://localhost:5000

Different ports = different "origins"

Browser security rule: "Don't let website A make requests to website B"

Solution: Express tells the browser "it's OK" by sending:
  Access-Control-Allow-Origin: *

The cors() package does this automatically.
```

---

## 🍃 MongoDB & Mongoose Concepts

### MongoDB Terminology vs SQL

| MongoDB | SQL equivalent |
|---|---|
| Database | Database |
| Collection | Table |
| Document | Row |
| Field | Column |
| `_id` | Primary key |

### A MongoDB Document (what's stored)
```json
{
  "_id": "64f3a2b1c9e4d5f6a7b8c9d0",
  "title": "Learn Mongoose",
  "completed": false,
  "createdAt": "2024-09-11T12:00:00.000Z",
  "updatedAt": "2024-09-11T12:00:00.000Z",
  "__v": 0
}
```

### Mongoose Schema
```js
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,   // must exist
    trim: true,       // removes whitespace
  },
  completed: {
    type: Boolean,
    default: false,   // value if not provided
  }
}, {
  timestamps: true    // auto adds createdAt and updatedAt
});
```

### Mongoose Model Methods
```js
// READ
const todos = await Todo.find({});                // get all
const todo  = await Todo.findById(id);            // get one by ID

// CREATE  
const newTodo = await Todo.create({ title });      // create + save

// UPDATE
const updated = await Todo.findByIdAndUpdate(
  id,
  { completed: true },
  { new: true }       // return updated doc, not old one
);

// DELETE
await Todo.findByIdAndDelete(id);
```

---

### Backend Files

#### `server/server.js`
Entry point. Loads `.env`, connects to MongoDB, then starts HTTP server.

#### `server/app.js`
Configures Express: registers middleware (cors, json) and mounts routes.

#### `server/config/db.js`
Single function `connectDB()`. Connects to MongoDB and exits on failure.

#### `server/models/Todo.js`
Mongoose Schema + Model. Defines the shape of a todo document.
Exports `Todo` model with methods like `Todo.find()`, `Todo.create()`.

#### `server/routes/todoRoutes.js`
Maps HTTP method + URL to controller functions. No logic — just routing.

#### `server/controllers/todoController.js`
All CRUD logic. Reads `req`, calls Mongoose methods, sends `res`.
Each function is async and wrapped in try/catch.

#### `server/.env`
Contains `PORT` and `MONGODB_URI`. Never committed to Git.

#### `server/.env.example`
Safe-to-commit template showing what variables are needed (no real values).

---

