const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const url = "mongodb://0.0.0.0:27017/";

// const url = "mongodb://localhost:27017";
const DatabaseName = "Master_Creation";
const client = new MongoClient(url);
async function DbConnect() {
  let result = await client.connect();
  db = result.db(DatabaseName);
  return db;
}
module.exports = DbConnect;
