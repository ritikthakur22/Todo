import mongoose from 'mongoose';

const uri = "mongodb+srv://intern8734:intern7094@intern.w6py6dj.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const connection = await mongoose.connect(uri);
  const admin = connection.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log("Databases:");
  dbs.databases.forEach(db => console.log(` - ${db.name}`));
  process.exit(0);
}
run();
