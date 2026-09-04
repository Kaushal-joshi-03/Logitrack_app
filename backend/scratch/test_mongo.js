const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function test() {
  console.log("Starting MongoMemoryServer from workspace...");
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log("MongoMemoryServer started at URI:", uri);
    
    await mongoose.connect(uri);
    console.log("Mongoose connected successfully!");
    
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("Cleaned up successfully!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
