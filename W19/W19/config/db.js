const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "student";

let db;

async function connectDB() {
  const client = await MongoClient.connect(url);
  db = client.db(dbName);
  console.log("✅ Connected to MongoDB successfully");
  console.log(`📦 Using database: ${dbName}`);
  return db;
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
