const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URI)
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found");
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
