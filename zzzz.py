
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'test';

const mongoClient = new MongoClient(url);
mongoClient.connect(function(err, client) {
  const db = client.db(dbName);
  client.close();
});