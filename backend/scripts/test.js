require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Setup env variables before loading app
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test_secret_1234567890';
process.env.JWT_EXPIRE = '1h';
process.env.NODE_ENV = 'test';

let mongod;
let server;

async function runTests() {
  console.log('Starting In-Memory MongoDB Server...');
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    console.log(`In-Memory MongoDB started at ${uri}`);
  } catch (err) {
    console.error('Failed to start in-memory MongoDB:', err.message);
    console.log('Falling back to local MongoDB at mongodb://localhost:27017/logistics-test');
    process.env.MONGO_URI = 'mongodb://localhost:27017/logistics-test';
  }

  // Clear Mongoose models to prevent rebuild errors if any
  mongoose.models = {};
  mongoose.modelSchemas = {};

  // Import the server (this will connect to process.env.MONGO_URI and start listen on 5001)
  console.log('Starting Express server...');
  require('../server');

  // Wait a short moment for mongoose connection and server startup
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n--- Running Integration Sanity Tests ---\n');

  let failedTests = 0;
  let passedTests = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.log(`  [FAIL] ${message}`);
      failedTests++;
    }
  };

  const baseUrl = 'http://localhost:5001/api';

  try {
    // ----------------------------------------------------
    // TEST 1: Seed Initial Users
    // ----------------------------------------------------
    console.log('Test 1: Seeding Users...');
    const User = require('../models/User');
    const Package = require('../models/Package');
    const PackageHistory = require('../models/PackageHistory');
    const Counter = require('../models/Counter');

    // Clean DB just in case
    await User.deleteMany({});
    await Package.deleteMany({});
    await PackageHistory.deleteMany({});
    await Counter.deleteMany({});

    const password = 'password123';
    const adminUser = await User.create({ name: 'Admin', email: 'admin@test.com', password, role: 'admin' });
    const clientA = await User.create({ name: 'Client A', email: 'clienta@test.com', password, role: 'client' });
    const clientB = await User.create({ name: 'Client B', email: 'clientb@test.com', password, role: 'client' });
    const warehouseUser = await User.create({ name: 'Warehouse', email: 'warehouse@test.com', password, role: 'warehouse' });
    const distributorUser = await User.create({ name: 'Distributor', email: 'distributor@test.com', password, role: 'distributor' });
    const driverA = await User.create({ name: 'Alice Driver', email: 'alice@test.com', password, role: 'delivery_person' });
    const driverB = await User.create({ name: 'Bob Driver', email: 'bob@test.com', password, role: 'delivery_person' });

    assert(adminUser && clientA && clientB && warehouseUser && distributorUser && driverA && driverB, 'Successfully seeded all roles');

    // ----------------------------------------------------
    // TEST 2: User Login
    // ----------------------------------------------------
    console.log('\nTest 2: Logging in users...');
    
    const login = async (email) => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const body = await res.json();
      return { status: res.status, body };
    };

    const loginClientA = await login('clienta@test.com');
    const loginClientB = await login('clientb@test.com');
    const loginWarehouse = await login('warehouse@test.com');
    const loginDistributor = await login('distributor@test.com');
    const loginDriverA = await login('alice@test.com');
    const loginDriverB = await login('bob@test.com');

    assert(loginClientA.status === 200 && loginClientA.body.success, 'Client A logged in successfully');
    assert(loginWarehouse.status === 200 && loginWarehouse.body.success, 'Warehouse logged in successfully');

    const tokenClientA = loginClientA.body.data.token;
    const tokenClientB = loginClientB.body.data.token;
    const tokenWarehouse = loginWarehouse.body.data.token;
    const tokenDistributor = loginDistributor.body.data.token;
    const tokenDriverA = loginDriverA.body.data.token;
    const tokenDriverB = loginDriverB.body.data.token;

    // ----------------------------------------------------
    // TEST 3: Create Package Request & ID Generation
    // ----------------------------------------------------
    console.log('\nTest 3: Creating delivery requests (packages)...');

    const createPkg = async (token, description, flowType = 'standard') => {
      const res = await fetch(`${baseUrl}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          weight: 1.5,
          dimensions: { length: 10, width: 10, height: 10 },
          flowType
        })
      });
      const body = await res.json();
      return { status: res.status, body };
    };

    const pkgRes1 = await createPkg(tokenClientA, 'Chemistry Lab Samples', 'standard');
    const pkgRes2 = await createPkg(tokenClientA, 'Express Chemistry Samples', 'express');

    assert(pkgRes1.status === 201 && pkgRes1.body.success, 'Package 1 created successfully by Client A');
    assert(pkgRes1.body.data.packageId === 'PKG-2026-000001', 'Package 1 has correct ID sequence (PKG-2026-000001)');
    assert(pkgRes2.body.data.packageId === 'PKG-2026-000002', 'Package 2 has correct incremented ID sequence (PKG-2026-000002)');
    assert(pkgRes2.body.data.flowType === 'express', 'Package 2 is successfully marked as express');

    const pkgId1 = pkgRes1.body.data.packageId; // PKG-2026-000001 (Standard)
    const pkgId2 = pkgRes2.body.data.packageId; // PKG-2026-000002 (Express)

    // ----------------------------------------------------
    // TEST 4: Authorization and Route Restrictions
    // ----------------------------------------------------
    console.log('\nTest 4: Testing RBAC route restrictions...');

    // Warehouse route access check
    const warehouseAccessByClient = await fetch(`${baseUrl}/warehouse/packages`, {
      headers: { 'Authorization': `Bearer ${tokenClientA}` }
    });
    assert(warehouseAccessByClient.status === 403, 'Client is rejected from warehouse routes with 403');

    const warehouseAccessByWarehouse = await fetch(`${baseUrl}/warehouse/packages`, {
      headers: { 'Authorization': `Bearer ${tokenWarehouse}` }
    });
    assert(warehouseAccessByWarehouse.status === 200, 'Warehouse worker can access warehouse routes with 200');

    // ----------------------------------------------------
    // TEST 5: Data Isolation and Access Scope
    // ----------------------------------------------------
    console.log('\nTest 5: Testing package details data isolation...');

    // Client B trying to fetch Client A's package
    const accessPkgAByClientB = await fetch(`${baseUrl}/packages/${pkgId1}`, {
      headers: { 'Authorization': `Bearer ${tokenClientB}` }
    });
    assert(accessPkgAByClientB.status === 403, 'Client B is blocked from viewing Client A package with 403');

    const accessPkgAByClientA = await fetch(`${baseUrl}/packages/${pkgId1}`, {
      headers: { 'Authorization': `Bearer ${tokenClientA}` }
    });
    assert(accessPkgAByClientA.status === 200, 'Client A can view their own package with 200');

    // ----------------------------------------------------
    // TEST 6: Status Transitions & Verification Engine
    // ----------------------------------------------------
    console.log('\nTest 6: Testing status transitions & validation engine...');

    // Warehouse worker trying to jump straight to processed (REQUEST_CREATED -> PACKAGE_PROCESSED)
    const badTransition1 = await fetch(`${baseUrl}/warehouse/packages/${pkgId1}/process`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenWarehouse}`
      },
      body: JSON.stringify({ comments: 'Sorting direct' })
    });
    assert(badTransition1.status === 400, 'Warehouse cannot skip WAREHOUSE_RECEIVED status (returns 400)');

    // Distributor worker trying to check in express package at warehouse (not allowed)
    const badTransition2 = await fetch(`${baseUrl}/warehouse/packages/${pkgId2}/receive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenWarehouse}`
      }
    });
    // This is express flow, it doesn't support WAREHOUSE_RECEIVED transition.
    assert(badTransition2.status === 400, 'Warehouse cannot receive express flow package (returns 400)');

    // Valid standard route check-in: REQUEST_CREATED -> WAREHOUSE_RECEIVED (Warehouse role)
    const goodTransition1 = await fetch(`${baseUrl}/warehouse/packages/${pkgId1}/receive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenWarehouse}`
      },
      body: JSON.stringify({ location: 'Warehouse Intake A', comments: 'Item checked in' })
    });
    assert(goodTransition1.status === 200, 'Warehouse received package 1 successfully (returns 200)');

    // Check PackageHistory is updated correctly
    const historyRes = await fetch(`${baseUrl}/packages/${pkgId1}/history`, {
      headers: { 'Authorization': `Bearer ${tokenClientA}` }
    });
    const historyData = await historyRes.json();
    assert(
      historyRes.status === 200 && historyData.data.length === 2, 
      'History document was automatically created on status transition (Total 2 entries)'
    );
    assert(
      historyData.data[1].status === 'WAREHOUSE_RECEIVED' && historyData.data[1].updatedBy.role === 'warehouse',
      'History contains correct status transition details and handler role'
    );

    // ----------------------------------------------------
    // TEST 7: Express Flow (Skip Warehouse)
    // ----------------------------------------------------
    console.log('\nTest 7: Testing express flow bypass...');

    // Express package: REQUEST_CREATED -> DISTRIBUTOR_RECEIVED (Distributor role)
    const expressTransition = await fetch(`${baseUrl}/distributor/packages/${pkgId2}/receive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDistributor}`
      },
      body: JSON.stringify({ location: 'Central Hub', comments: 'Direct express route' })
    });
    assert(expressTransition.status === 200, 'Distributor successfully received express package directly (skips warehouse)');

    // ----------------------------------------------------
    // TEST 8: Assignment and Driver Access Restrictions
    // ----------------------------------------------------
    console.log('\nTest 8: Testing courier assignments and driver limits...');

    // Assign Express Package (PKG-2026-000002) to Driver A (Alice)
    const assignRes = await fetch(`${baseUrl}/distributor/packages/${pkgId2}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDistributor}`
      },
      body: JSON.stringify({
        deliveryPersonId: driverA._id.toString(),
        comments: 'Assigned to Alice'
      })
    });
    assert(assignRes.status === 200, 'Distributor assigned express package to Alice (Driver A)');

    // Driver B (Bob) tries to access Alice's package
    const driverBAccessRes = await fetch(`${baseUrl}/packages/${pkgId2}`, {
      headers: { 'Authorization': `Bearer ${tokenDriverB}` }
    });
    assert(driverBAccessRes.status === 403, 'Driver B (Bob) is blocked from accessing Alice\'s package details with 403');

    // Driver B tries to mark Alice's package out-for-delivery
    const driverBModifyRes = await fetch(`${baseUrl}/delivery/packages/${pkgId2}/out-for-delivery`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDriverB}`
      }
    });
    assert(driverBModifyRes.status === 403, 'Driver B (Bob) is blocked from updating Alice\'s package status with 403');

    // Driver A (Alice) updates status: ASSIGNED_FOR_DELIVERY -> OUT_FOR_DELIVERY -> DELIVERED
    const aliceTransitRes = await fetch(`${baseUrl}/delivery/packages/${pkgId2}/out-for-delivery`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDriverA}`
      }
    });
    assert(aliceTransitRes.status === 200, 'Driver A (Alice) marked package out-for-delivery');

    const aliceDeliverRes = await fetch(`${baseUrl}/delivery/packages/${pkgId2}/deliver`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDriverA}`
      }
    });
    assert(aliceDeliverRes.status === 200, 'Driver A (Alice) marked package delivered');

    const finalPkgRes = await fetch(`${baseUrl}/packages/${pkgId2}`, {
      headers: { 'Authorization': `Bearer ${tokenClientA}` }
    });
    const finalPkg = await finalPkgRes.json();
    assert(finalPkg.body?.data?.status || finalPkg.data.status === 'DELIVERED', 'Package status is correctly saved as DELIVERED');

    // ----------------------------------------------------
    // TEST 9: Package Input Validation (Negative Tests)
    // ----------------------------------------------------
    console.log('\nTest 9: Testing package input validation...');

    // Negative weight
    const negWeightRes = await fetch(`${baseUrl}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenClientA}`
      },
      body: JSON.stringify({
        description: 'Negative Weight Test',
        weight: -5
      })
    });
    assert(negWeightRes.status === 400, 'Rejects negative weight with 400');

    // Non-numeric weight
    const nonNumWeightRes = await fetch(`${baseUrl}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenClientA}`
      },
      body: JSON.stringify({
        description: 'String Weight Test',
        weight: 'invalid-number'
      })
    });
    assert(nonNumWeightRes.status === 400, 'Rejects non-numeric weight with 400');

    // Missing weight
    const missingWeightRes = await fetch(`${baseUrl}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenClientA}`
      },
      body: JSON.stringify({
        description: 'Missing Weight Test'
      })
    });
    assert(missingWeightRes.status === 400, 'Rejects missing weight with 400');

    // ----------------------------------------------------
    // TEST 10: Authentication Negative Edge Cases
    // ----------------------------------------------------
    console.log('\nTest 10: Testing auth negative edge cases...');

    // Wrong password login
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'clienta@test.com', password: 'wrongpassword' })
    });
    assert(wrongPassRes.status === 401, 'Rejects incorrect password with 401');

    // Non-existent user login
    const nonExistentUserRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@nowhere.com', password: 'password123' })
    });
    assert(nonExistentUserRes.status === 401, 'Rejects non-existent email with 401');

    // Duplicate email registration
    const dupRegisterRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Client Duplicate', email: 'clienta@test.com', password: 'password123', role: 'client' })
    });
    assert(dupRegisterRes.status === 409, 'Rejects duplicate email registration with 409 Conflict');

    // Invalid email format registration
    const invalidEmailRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bad Email', email: 'notanemail', password: 'password123', role: 'client' })
    });
    assert(invalidEmailRes.status === 400, 'Rejects invalid email format with 400');

    // Short password registration
    const shortPassRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Short Pass', email: 'short@test.com', password: '123', role: 'client' })
    });
    assert(shortPassRes.status === 400, 'Rejects password shorter than 6 characters with 400');

    // Unauthenticated access to protected route
    const unauthRes = await fetch(`${baseUrl}/packages/my`);
    assert(unauthRes.status === 401, 'Rejects unauthenticated request to /api/packages/my with 401');

    // Tampered token
    const tamperedRes = await fetch(`${baseUrl}/packages/my`, {
      headers: { 'Authorization': 'Bearer invalid.fake.token' }
    });
    assert(tamperedRes.status === 401, 'Rejects invalid/tampered token with 401');

    // ----------------------------------------------------
    // TEST 11: Public Tracking Edge Cases & Privacy Check
    // ----------------------------------------------------
    console.log('\nTest 11: Testing public tracking & privacy sanitization...');

    // Public track existing package
    const publicTrackRes = await fetch(`${baseUrl}/packages/public/track/${pkgId1}`);
    const publicTrackData = await publicTrackRes.json();
    assert(publicTrackRes.status === 200, 'Public tracking endpoint returns 200 for valid ID');
    assert(!publicTrackData.data.client, 'Public tracking does NOT expose client object or email');
    assert(publicTrackData.data.senderPhone.includes('••••'), 'Public tracking masks sender phone number');

    // Public track non-existent package
    const nonExistentTrackRes = await fetch(`${baseUrl}/packages/public/track/PKG-NONEXISTENT-9999`);
    assert(nonExistentTrackRes.status === 404, 'Public tracking returns 404 for non-existent package');

    // Public history non-existent package
    const nonExistentHistRes = await fetch(`${baseUrl}/packages/public/track/PKG-NONEXISTENT-9999/history`);
    assert(nonExistentHistRes.status === 404, 'Public history returns 404 for non-existent package');

    // ----------------------------------------------------
    // TEST 12: Terminal State & Role Boundary Violations
    // ----------------------------------------------------
    console.log('\nTest 12: Testing terminal state transition constraints...');

    // Attempting to move delivered package (terminal state)
    const deliverAgainRes = await fetch(`${baseUrl}/delivery/packages/${pkgId2}/deliver`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDriverA}`
      }
    });
    assert(deliverAgainRes.status === 400, 'Package in DELIVERED status cannot be transitioned further (returns 400)');

    // Driver attempting to perform warehouse action
    const driverAtWarehouseRes = await fetch(`${baseUrl}/warehouse/packages/${pkgId1}/receive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDriverA}`
      }
    });
    assert(driverAtWarehouseRes.status === 403, 'Driver is rejected from warehouse actions with 403');

    // ----------------------------------------------------
    // TEST 13: AI Support Chat Endpoint Smoke Test
    // ----------------------------------------------------
    console.log('\nTest 13: Testing AI support chat endpoint...');

    // Empty message
    const emptyChatRes = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(emptyChatRes.status === 400, 'Chat endpoint rejects empty message with 400');

    // Valid query
    const validChatRes = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I track my package?' })
    });
    const chatData = await validChatRes.json();
    assert(validChatRes.status === 200 && chatData.success && (chatData.reply || chatData.message), 'Chat endpoint responds with valid message');

  } catch (err) {
    console.error('Test execution error occurred:', err);
    failedTests++;
  }

  console.log('\n----------------------------------------');
  console.log(`TESTS COMPLETED. Passed: ${passedTests}, Failed: ${failedTests}`);
  console.log('----------------------------------------\n');

  // Exit code based on failures
  process.exit(failedTests > 0 ? 1 : 0);
}

runTests();
