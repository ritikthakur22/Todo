# 📝 Todo App - Full-Stack Real-Time Workspace

<div align="center">
  <p><strong>A full-stack task management and real-time collaboration application powered by React, Vite, Express, Socket.io, and MongoDB Atlas.</strong></p>

  <p>
    <a href="https://todocrdy.vercel.app/"><img src="https://img.shields.io/badge/Vercel-Live_Demo-success?style=flat-square&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-8-purple?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4-black?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
    <img src="https://img.shields.io/badge/Socket.io-4-black?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.io" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License: MIT" /></a>
    <a href="https://www.ritikthakur.com.np"><img src="https://img.shields.io/badge/Author-Ritik%20Thakur-blue?style=flat-square" alt="Author: Ritik Thakur" /></a>
  </p>
</div>

---

![Dashboard Screenshot](./assets/screenshot.png)

🌐 **Live Application:** [https://todocrdy.vercel.app/](https://todocrdy.vercel.app/)



## 🚀 Version 2.0 Mega Update Features
- **Real-Time Collaboration**: Instant sync across all connected clients via `socket.io` WebSockets.
- **Optimistic UI**: Instant perceived performance (zero-latency UI updates) powered by `@tanstack/react-query`.
- **Drag & Drop Reordering**: Fluid sorting with `@dnd-kit/sortable`.
- **Advanced Task Management**: Subtasks, Priority badges, Categories, Assignments, and Due Dates.
- **Image Attachments**: Securely upload and host images using `Cloudinary` + `Multer`.
- **Infinite Scrolling**: Auto-loads more tasks using the `IntersectionObserver` API as you scroll.
- **Global Dashboard Statistics**: Live analytical breakdown (Total, Completed, Pending).
- **Advanced Keyboard Navigation**: `Ctrl+Enter` shortcut, `Escape` to close, and an accessible Focus Trap inside modals.
- **Nepali Date System**: Integrated `nepali-date-converter` for dual date display (BS).

## 🛠 What is Used
- **Frontend**: React.js, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas) & Mongoose
- **Other Tools**: Postman, MongoDB Compass, Cloudinary, Socket.io, React Query, Dnd-Kit

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
- **Trash feature**: instead of deleting the todos permanently, it moves them to the trash and can be restored. Trash ui is hidden and can be opened with alt + r + t shortcut.

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


## 🌍 Production Deployment

This project uses a decoupled deployment strategy for maximum performance and stability:

### 1. Backend (Render)
The Node.js/Express server is hosted on [Render](https://render.com).
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `5000`
  - `MONGODB_URI`: Your MongoDB Atlas connection string.

### 2. Frontend (Vercel)
The React/Vite client is hosted on [Vercel](https://vercel.com) for global CDN edge delivery.
- **Root Directory**: `client`
- **Environment Variables**:
  - `VITE_API_URL`: The live URL provided by Render (e.g., `https://todo-crdy.onrender.com/api/todos`)

---

## 📚 Additional Guides
For more detailed information, please check out:
- [Frontend Guide](./client/README.md)
- [Backend Guide](./server/README.md)

---

## 📄 License & Attribution

This project is open-source and licensed under the [MIT License](LICENSE).

Developed by [Ritik Thakur](https://www.ritikthakur.com.np).
