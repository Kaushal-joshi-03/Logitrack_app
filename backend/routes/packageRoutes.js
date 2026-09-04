const express = require('express');
const router = express.Router();
const {
  createPackage,
  getMyPackages,
  getPackageDetails,
  getPackageHistory,
  getPackageDetailsPublic,
  getPackageHistoryPublic
} = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Shipment lifecycle management, creation, client retrieval, and tracking
 */

/**
 * @swagger
 * /api/packages/public/track/{packageId}:
 *   get:
 *     summary: Publicly track a package by ID
 *     description: Retrieve public shipment status, details, origin, and destination without requiring login.
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Human-readable unique package identifier (e.g. PKG-2026-0001)
 *         example: PKG-2026-0001
 *     responses:
 *       200:
 *         description: Package details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Package details retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/public/track/:packageId', getPackageDetailsPublic);

/**
 * @swagger
 * /api/packages/public/track/{packageId}/history:
 *   get:
 *     summary: Publicly get package transition history
 *     description: Retrieve timeline history logs for a package without requiring login.
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Human-readable unique package identifier
 *         example: PKG-2026-0001
 *     responses:
 *       200:
 *         description: Package tracking history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Package history retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PackageHistory'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/public/track/:packageId/history', getPackageHistoryPublic);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new shipment / package
 *     description: Allows authenticated clients to create a delivery request with pickup & receiver details.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *             properties:
 *               senderName:
 *                 type: string
 *                 example: Rajesh Sharma
 *               senderPhone:
 *                 type: string
 *                 example: +91 9876543210
 *               pickupAddress:
 *                 type: string
 *                 example: 12 MG Road, Indiranagar
 *               receiverName:
 *                 type: string
 *                 example: Priya Patel
 *               receiverPhone:
 *                 type: string
 *                 example: +91 9123456780
 *               deliveryAddress:
 *                 type: string
 *                 example: 45 Bandra West
 *               originCity:
 *                 type: string
 *                 example: Bengaluru
 *               destinationCity:
 *                 type: string
 *                 example: Mumbai
 *               description:
 *                 type: string
 *                 example: Fragile Electronics Equipment
 *               weight:
 *                 type: number
 *                 example: 3.5
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length: { type: number, example: 20 }
 *                   width: { type: number, example: 15 }
 *                   height: { type: number, example: 10 }
 *               priority:
 *                 type: string
 *                 enum: [Standard, Express, Urgent]
 *                 example: Standard
 *               flowType:
 *                 type: string
 *                 enum: [standard, express]
 *                 example: standard
 *     responses:
 *       201:
 *         description: Delivery request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Delivery request created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - Requires Client role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/', protect, authorize('client'), createPackage);

/**
 * @swagger
 * /api/packages/my:
 *   get:
 *     summary: Get all shipments created by the logged-in client
 *     description: Returns the shipment list belonging to the authenticated client.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of client packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Packages retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - Requires Client role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/my', protect, authorize('client'), getMyPackages);

/**
 * @swagger
 * /api/packages/{packageId}:
 *   get:
 *     summary: Get package details (Authenticated)
 *     description: Retrieve detailed information for a package. Accessible by admin, warehouse, distributor, or the client/driver assigned to the package.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Human-readable package identifier
 *         example: PKG-2026-0001
 *     responses:
 *       200:
 *         description: Package details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Package details retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Access denied for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:packageId', protect, getPackageDetails);

/**
 * @swagger
 * /api/packages/{packageId}/history:
 *   get:
 *     summary: Get package timeline history (Authenticated)
 *     description: Retrieve timeline and audit log for a package.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Human-readable package identifier
 *         example: PKG-2026-0001
 *     responses:
 *       200:
 *         description: Package history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Package history retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PackageHistory'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Access denied for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:packageId/history', protect, getPackageHistory);

module.exports = router;

