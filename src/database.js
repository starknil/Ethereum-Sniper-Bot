const { MongoClient } = require('mongodb');
const mongoUri = "mongodb+srv://judgetorres:judgetorres1234@judgetorres.64yjcqg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri);
let databaseName,db,stark;
databaseName = "Ethreum-Sniper-Bot";

const connectDataBase = async () => {
  try {
    await client.connect();
    console.log("Connected to Bot database");
    db = client.db(databaseName);
    stark = db.collection("All-Users");
  } catch (e) {
    console.log("Error connecting to MongoDB:", e.errorResponse.errmsg);
    process.exit(0);
  }
}

const getUser = async (user) => {
  try {
    const u = await stark.findOne({ userId: user });
    return u;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const addUser = async (user) => {
  try {
    await stark.insertOne(user);
    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const updateUser = async (user, data) => {
  try {
    await stark.updateOne({ userId: user }, data);
    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const allUser = async () => {
  try {
    const res = await stark.find({}).toArray();
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
}


const find = async (query) => {
  try {
    const res = await stark.find(query,{ projection: { userId: 1, _id: 0 } }).toArray();
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  connectDataBase,
  getUser,
  addUser,
  updateUser,
  allUser,
  find
}