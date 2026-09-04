const express = require('express');
const router = express.Router();
const {
  getWarehousePackages,
  receivePackage,
  processPackage
} = require('../controllers/warehouseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Warehouse
 *   description: Warehouse operations (receiving standard packages and processing/sorting)
 */

// All routes are warehouse only
router.use(protect, authorize('warehouse'));

/**
 * @swagger
 * /api/warehouse/packages:
 *   get:
 *     summary: Get warehouse actionable packages
 *     description: Retrieve all packages that require warehouse intake (REQUEST_CREATED standard flow) or processing (WAREHOUSE_RECEIVED).
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of actionable packages for the warehouse
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
 *                   example: Warehouse packages retrieved
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
 *         description: Forbidden - Requires Warehouse role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/packages', getWarehousePackages);

/**
 * @swagger
 * /api/warehouse/packages/{packageId}/receive:
 *   patch:
 *     summary: Receive package at warehouse
 *     description: Transitions package status from REQUEST_CREATED to WAREHOUSE_RECEIVED.
 *     tags: [Warehouse]
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *                 example: Package safely unloaded at primary bay.
 *               location:
 *                 type: string
 *                 example: Warehouse Intake Bay 3
 *     responses:
 *       200:
 *         description: Package successfully marked as received at warehouse
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
 *                   example: Package received at warehouse
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       400:
 *         description: Invalid state transition
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
 *         description: Forbidden - Requires Warehouse role
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
router.patch('/packages/:packageId/receive', receivePackage);

/**
 * @swagger
 * /api/warehouse/packages/{packageId}/process:
 *   patch:
 *     summary: Process and pack package at warehouse
 *     description: Transitions package status from WAREHOUSE_RECEIVED to PACKAGE_PROCESSED.
 *     tags: [Warehouse]
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *                 example: Barcode scanned, sorted into Mumbai destination bin.
 *               location:
 *                 type: string
 *                 example: Warehouse Sorting Line B
 *     responses:
 *       200:
 *         description: Package successfully processed
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
 *                   example: Package processed at warehouse
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       400:
 *         description: Invalid state transition
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
 *         description: Forbidden - Requires Warehouse role
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
router.patch('/packages/:packageId/process', processPackage);

module.exports = router;

