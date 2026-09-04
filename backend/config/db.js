const mongoose = require('mongoose');
const dns = require('dns');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Override DNS servers programmatically to bypass Windows/router Node.js SRV resolution bugs
dns.setServers(['8.8.8.8', '1.1.1.1']);

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('Please define MONGO_URI or MONGODB_URI in your environment');
    }

    // Safely append database name to raw cluster connection string if database name isn't specified
    const urlParts = uri.split('?');
    const base = urlParts[0];
    const query = urlParts[1] ? `?${urlParts[1]}` : '';
    
    // Check if base URL ends with cluster hostname and has no db path
    const pathParts = base.replace('mongodb+srv://', '').replace('mongodb://', '').split('/');
    if (pathParts.length === 1 || pathParts[1] === '') {
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
      uri = `${cleanBase}/logistics-tracking${query}`;
    }

    console.log('Connecting to MongoDB Atlas...');
    // Add serverSelectionTimeoutMS to fail fast if IP not whitelisted
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (err) {
    console.warn(`MongoDB Atlas connection failed: ${err.message}.`);
    console.warn('Falling back to local in-memory MongoDB Server (MongoMemoryServer)...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const localUri = mongoServer.getUri();
      console.log(`Starting in-memory database at: ${localUri}`);
      const conn = await mongoose.connect(localUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      
      // Auto-seed in-memory database since it starts empty
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('In-memory database is empty. Seeding demo accounts...');
        const { seedDataDirectly } = require('../scripts/seedDirectly');
        await seedDataDirectly();
      }
    } catch (fallbackErr) {
      console.error(`Local MongoDB fallback failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

