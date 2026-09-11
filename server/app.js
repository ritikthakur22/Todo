// app.js — Express application setup.
//
// Responsibility: Configure Express — middleware, routes.
// Does NOT start the server (that's server.js's job).
//
// What is Express?
// Express is a framework built on top of Node.js.
// It makes it easy to:
//   - Receive HTTP requests (GET, POST, PUT, DELETE)
//   - Run middleware (functions that process requests)
//   - Send HTTP responses back to the client (React)

import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';


// --- Create the Express application ---
// express() returns an "app" object with methods like:
//   app.get(), app.post(), app.use(), app.listen()
const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────────
//
// Middleware = functions that run on EVERY request before it
// reaches your route handlers. Think of it like a pipeline:
//
//   Request → middleware 1 → middleware 2 → route handler → Response
//
// app.use() registers a middleware for all routes.

// CORS Middleware — Cross-Origin Resource Sharing
// PROBLEM: Browsers block requests between different "origins".
// React runs on http://localhost:5173
// Express runs on http://localhost:5000
// These are DIFFERENT origins (different ports).
// Without CORS, the browser refuses to let React talk to Express.
// cors() adds special HTTP headers that tell the browser: "it's ok".
app.use(cors());

// JSON Middleware
// When React sends a POST/PUT request with a body (e.g., a new todo),
// the data arrives as raw text. express.json() automatically parses
// it into a JavaScript object so we can use req.body in our routes.
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────
// Mount todoRoutes at '/api/todos'.
// This means every route defined in todoRoutes.js will be
// prefixed with /api/todos automatically.
//
// So router.get('/')    → handles GET    /api/todos
//    router.post('/')   → handles POST   /api/todos
//    router.put('/:id') → handles PUT    /api/todos/:id
// etc.
app.use('/api/todos', todoRoutes);

export default app;

