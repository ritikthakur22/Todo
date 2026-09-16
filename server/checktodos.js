import mongoose from 'mongoose';
import Todo from './models/Todo.js';

const uri = "mongodb+srv://intern8734:intern7094@intern.w6py6dj.mongodb.net/tododb?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(uri);
  const count = await Todo.countDocuments();
  console.log(`Total todos: ${count}`);
  const sample = await Todo.find().limit(3);
  console.log(sample.map(t => t.title));
  process.exit(0);
}
run();
