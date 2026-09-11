// server.js — Entry point. Connects to MongoDB THEN starts the server.
//
// ORDER MATTERS:
//   1. Load environment variables (.env)
//   2. Connect to MongoDB
//   3. Start listening for requests
//
// Why connect to DB first?
// If we start accepting requests before the DB is ready,
// any request that touches the database would fail immediately.

import 'dotenv/config';   // loads .env into process.env (must be FIRST)
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});
