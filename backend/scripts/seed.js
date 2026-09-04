const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS servers programmatically to bypass Windows/router Node.js SRV resolution bugs
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
const User = require('../models/User');
const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');
const Counter = require('../models/Counter');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error('Error: Please define MONGO_URI or MONGODB_URI in your .env file.');
      process.exit(1);
    }

    // Safely append database name to raw cluster connection string if database name isn't specified
    let cleanUri = uri;
    const urlParts = uri.split('?');
    const base = urlParts[0];
    const query = urlParts[1] ? `?${urlParts[1]}` : '';
    const pathParts = base.replace('mongodb+srv://', '').replace('mongodb://', '').split('/');
    if (pathParts.length === 1 || pathParts[1] === '') {
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
      cleanUri = `${cleanBase}/logistics-tracking${query}`;
    }

    console.log('Connecting to database...');
    await mongoose.connect(cleanUri);
    console.log('Connected. Clearing existing collections...');

    // Clear existing data
    await User.deleteMany({});
    await Package.deleteMany({});
    await PackageHistory.deleteMany({});
    await Counter.deleteMany({});

    console.log('Seeding users...');
    
    // Default password for all users
    const defaultPassword = 'password123';

    // Create users
    const admin = await User.create({
      name: 'Chief Operator',
      email: 'admin@logistics.edu',
      password: defaultPassword,
      role: 'admin'
    });

    const clientPhysics = await User.create({
      name: 'Department of Physics',
      email: 'physics@logistics.edu',
      password: defaultPassword,
      role: 'client'
    });

    const clientChemistry = await User.create({
      name: 'Lab Chemistry',
      email: 'chemistry@logistics.edu',
      password: defaultPassword,
      role: 'client'
    });

    const warehouse = await User.create({
      name: 'Warehouse Admin',
      email: 'warehouse@logistics.edu',
      password: defaultPassword,
      role: 'warehouse'
    });

    const distributor = await User.create({
      name: 'Hub Manager',
      email: 'distributor@logistics.edu',
      password: defaultPassword,
      role: 'distributor'
    });

    const deliveryAlice = await User.create({
      name: 'Courier Alice',
      email: 'alice@logistics.edu',
      password: defaultPassword,
      role: 'delivery_person'
    });

    const deliveryBob = await User.create({
      name: 'Courier Bob',
      email: 'bob@logistics.edu',
      password: defaultPassword,
      role: 'delivery_person'
    });

    console.log('Seeding packages...');

    // Package 1: REQUEST_CREATED (Standard flow)
    const pkg1 = await Package.create({
      packageId: 'PKG-2026-000001',
      client: clientPhysics._id,
      description: 'Lab equipment chemistry set',
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      status: 'REQUEST_CREATED',
      flowType: 'standard',
      senderName: 'Department of Physics',
      senderPhone: '9876500001',
      receiverName: 'Lab Chemistry',
      receiverPhone: '9876500002',
      originCity: 'Delhi',
      destinationCity: 'Mumbai',
      pickupAddress: 'Physics Block, University Campus, Delhi',
      deliveryAddress: 'Chemistry Lab, Science Building, Mumbai'
    });

    await PackageHistory.create({
      package: pkg1._id,
      packageId: pkg1.packageId,
      status: 'REQUEST_CREATED',
      updatedBy: clientPhysics._id,
      comments: 'Delivery request submitted by client.',
      location: 'Origin'
    });

    // Package 2: WAREHOUSE_RECEIVED (Standard flow)
    const pkg2 = await Package.create({
      packageId: 'PKG-2026-000002',
      client: clientPhysics._id,
      description: 'Optics lenses batch A',
      weight: 1.2,
      dimensions: { length: 20, width: 15, height: 10 },
      status: 'WAREHOUSE_RECEIVED',
      flowType: 'standard',
      senderName: 'Department of Physics',
      senderPhone: '9876500001',
      receiverName: 'Lab Chemistry',
      receiverPhone: '9876500002',
      originCity: 'Delhi',
      destinationCity: 'Ahmedabad',
      pickupAddress: 'Physics Block, University Campus, Delhi',
      deliveryAddress: 'Optics Research Wing, Ahmedabad Institute'
    });

    await PackageHistory.create([
      {
        package: pkg2._id,
        packageId: pkg2.packageId,
        status: 'REQUEST_CREATED',
        updatedBy: clientPhysics._id,
        comments: 'Delivery request submitted by client.',
        location: 'Origin',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        package: pkg2._id,
        packageId: pkg2.packageId,
        status: 'WAREHOUSE_RECEIVED',
        updatedBy: warehouse._id,
        comments: 'Package received at warehouse facility.',
        location: 'Warehouse Intake'
      }
    ]);

    // Package 3: DELIVERED (Express flow - skips warehouse)
    const pkg3 = await Package.create({
      packageId: 'PKG-2026-000003',
      client: clientChemistry._id,
      description: 'Organic solvents reagent flasks',
      weight: 4.8,
      dimensions: { length: 40, width: 30, height: 25 },
      status: 'DELIVERED',
      flowType: 'express',
      assignedDeliveryPerson: deliveryAlice._id,
      senderName: 'Lab Chemistry',
      senderPhone: '9876500002',
      receiverName: 'Department of Physics',
      receiverPhone: '9876500001',
      originCity: 'Mumbai',
      destinationCity: 'Delhi',
      pickupAddress: 'Chemistry Lab, Science Building, Mumbai',
      deliveryAddress: 'Physics Block, University Campus, Delhi'
    });

    await PackageHistory.create([
      {
        package: pkg3._id,
        packageId: pkg3.packageId,
        status: 'REQUEST_CREATED',
        updatedBy: clientChemistry._id,
        comments: 'Express delivery request submitted by client.',
        location: 'Origin',
        createdAt: new Date(Date.now() - 14400000)
      },
      {
        package: pkg3._id,
        packageId: pkg3.packageId,
        status: 'DISTRIBUTOR_RECEIVED',
        updatedBy: distributor._id,
        comments: 'Express package checked in at distributor hub.',
        location: 'Distribution Hub Reception',
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        package: pkg3._id,
        packageId: pkg3.packageId,
        status: 'ASSIGNED_FOR_DELIVERY',
        updatedBy: distributor._id,
        comments: `Package assigned to driver ${deliveryAlice.name}.`,
        location: 'Distribution Dispatch',
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        package: pkg3._id,
        packageId: pkg3.packageId,
        status: 'OUT_FOR_DELIVERY',
        updatedBy: deliveryAlice._id,
        comments: 'Package loaded into delivery vehicle, out for delivery.',
        location: 'Delivery Transit',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        package: pkg3._id,
        packageId: pkg3.packageId,
        status: 'DELIVERED',
        updatedBy: deliveryAlice._id,
        comments: 'Package successfully delivered and signed.',
        location: 'Final Destination'
      }
    ]);

    // Package 4: ASSIGNED_FOR_DELIVERY (Standard flow)
    const pkg4 = await Package.create({
      packageId: 'PKG-2026-000004',
      client: clientPhysics._id,
      description: 'Laser diodes fragile kits',
      weight: 0.8,
      dimensions: { length: 15, width: 10, height: 5 },
      status: 'ASSIGNED_FOR_DELIVERY',
      flowType: 'standard',
      assignedDeliveryPerson: deliveryBob._id,
      senderName: 'Department of Physics',
      senderPhone: '9876500001',
      receiverName: 'Hub Manager',
      receiverPhone: '9876500003',
      originCity: 'Delhi',
      destinationCity: 'Jaipur',
      pickupAddress: 'Physics Block, University Campus, Delhi',
      deliveryAddress: 'Distribution Hub, Industrial Area, Jaipur'
    });

    await PackageHistory.create([
      {
        package: pkg4._id,
        packageId: pkg4.packageId,
        status: 'REQUEST_CREATED',
        updatedBy: clientPhysics._id,
        comments: 'Delivery request submitted.',
        location: 'Origin',
        createdAt: new Date(Date.now() - 14400000)
      },
      {
        package: pkg4._id,
        packageId: pkg4.packageId,
        status: 'WAREHOUSE_RECEIVED',
        updatedBy: warehouse._id,
        comments: 'Received and checked.',
        location: 'Warehouse Intake',
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        package: pkg4._id,
        packageId: pkg4.packageId,
        status: 'PACKAGE_PROCESSED',
        updatedBy: warehouse._id,
        comments: 'Processed and sorted.',
        location: 'Warehouse Sorting Floor',
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        package: pkg4._id,
        packageId: pkg4.packageId,
        status: 'DISTRIBUTOR_RECEIVED',
        updatedBy: distributor._id,
        comments: 'Received at hub.',
        location: 'Distribution Hub Reception',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        package: pkg4._id,
        packageId: pkg4.packageId,
        status: 'ASSIGNED_FOR_DELIVERY',
        updatedBy: distributor._id,
        comments: `Package assigned to driver ${deliveryBob.name}.`,
        location: 'Distribution Dispatch'
      }
    ]);

    // Initialize package sequence counters
    await Counter.create({
      _id: 'PKG_SEQ_2026',
      seq: 4
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedData();