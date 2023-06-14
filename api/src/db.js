const { MongoClient } = require("mongodb");

let dbConnection;
let uri = 'mongodb://127.0.0.1:27017';

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db()
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      })
  },
  getDb: () => dbConnection
}