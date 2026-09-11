# Todo App - Full Stack Project

## 📖 Definition and Basic Concept
This is a full-stack web application built to manage a simple Todo list. It allows users to create, read, update, and delete (CRUD) tasks. The project is split into a frontend client and a backend server, communicating via RESTful APIs.

## 🛠 What is Used
- **Frontend**: React.js, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas) & Mongoose
- **Other Tools**: Postman, MongoDB Compass

## 🤔 Why Used
- **React.js**: For building a fast, interactive user interface using a component-based architecture.
- **Node.js & Express**: To create a robust and scalable backend API quickly using JavaScript.
- **MongoDB**: A NoSQL database that perfectly pairs with JavaScript applications since it uses JSON-like documents.
- **Vite**: A modern frontend build tool that provides a much faster development server than Create React App.

## 🎯 Objectives
- Understand the complete request-response cycle between a client and a server.
- Learn how to structure a full-stack application (MVC pattern).
- Practice CRUD operations with a real database.
- Learn to manage environment variables and CORS.

## ✨ Pros
- **Separation of Concerns**: The frontend and backend are completely decoupled.
- **Scalability**: Can easily swap the frontend or backend without affecting the other.
- **Modern Workflow**: Uses modern tools like Vite and ES Modules.

## 🚀 Guide for Demo Running (Commands to Start)

### 1. Database Setup
Create a free MongoDB cluster on Atlas and get your connection string. 
In the `server` directory, create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

### 2. Start the Backend
Open a terminal and run:
```bash
cd server
npm install
npm run dev
```
The server will run on http://localhost:5000.

### 3. Start the Frontend
Open a second terminal and run:
```bash
cd client
npm install
npm run dev
```
The frontend will run on http://localhost:5173.

---
## 📚 Additional Guides
For more detailed information, please check out:
- [Frontend Guide](./client/README.md)
- [Backend Guide](./server/README.md)
