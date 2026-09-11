// config/db.js — Responsible for connecting to MongoDB.
//
// This is called ONCE when the server starts (in server.js).
// Once connected, Mongoose maintains the connection automatically.
// All subsequent model operations reuse this single connection.

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // mongoose.connect() opens a connection to MongoDB Atlas.
    // process.env.MONGODB_URI reads the value from our .env file.
    // dotenv (loaded in server.js) makes process.env work.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // conn.connection.host tells us which server we connected to
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and EXIT the process.
    // There's no point running the server if there's no database.
    // process.exit(1) means "exit with an error code"
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
