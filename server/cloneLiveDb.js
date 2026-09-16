import mongoose from 'mongoose';
import Todo from './models/Todo.js';

const uri = "mongodb+srv://intern8734:intern7094@intern.w6py6dj.mongodb.net/tododb?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    
    console.log("Wiping local database...");
    await Todo.deleteMany({});
    
    console.log("Fetching live database...");
    let allLiveTodos = [];
    let page = 1;
    let totalPages = 1;
    
    do {
      const res = await fetch(`https://todo-crdy.onrender.com/api/todos?page=${page}&limit=50`);
      const data = await res.json();
      allLiveTodos = allLiveTodos.concat(data.data);
      totalPages = data.pagination.pages;
      page++;
    } while (page <= totalPages);
    
    const insertData = allLiveTodos.map(t => {
      return t;
    });

    if (insertData.length > 0) {
      await Todo.insertMany(insertData);
      console.log(`Successfully cloned ${insertData.length} tasks from live site!`);
    } else {
      console.log("Live site is empty. Local DB is now also empty.");
    }

  } catch (error) {
    console.error("Error cloning DB:", error);
  } finally {
    process.exit(0);
  }
}
run();
