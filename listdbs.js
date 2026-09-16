const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://intern8734:intern7094@intern.w6py6dj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:");
    dbs.databases.forEach(db => console.log(` - ${db.name}`));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
