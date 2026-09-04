const express = require('express');
const router = express.Router();
const {
  getDistributorPackages,
  receivePackage,
  assignPackage,
  getDrivers
} = require('../controllers/distributorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Distributor
 *   description: Distribution hub operations (intake from warehouse or express, and driver dispatch)
 */

// All routes are distributor only
router.use(protect, authorize('distributor'));

/**
 * @swagger
 * /api/distributor/packages:
 *   get:
 *     summary: Get distributor actionable packages
 *     description: Retrieve packages arriving at hub (PACKAGE_PROCESSED or REQUEST_CREATED express) or awaiting assignment (DISTRIBUTOR_RECEIVED).
 *     tags: [Distributor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of actionable packages for distribution hub
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
 *                   example: Distributor packages retrieved
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
 *         description: Forbidden - Requires Distributor role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/packages', getDistributorPackages);

/**
 * @swagger
 * /api/distributor/drivers:
 *   get:
 *     summary: Get available delivery drivers
 *     description: List all delivery personnel accounts available for package assignment.
 *     tags: [Distributor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of delivery drivers
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
 *                   example: Drivers retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string, example: '662bfe1a8a2d123456789abc' }
 *                       name: { type: string, example: 'Suresh Kumar' }
 *                       email: { type: string, example: 'driver1@example.com' }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - Requires Distributor role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/drivers', getDrivers);

/**
 * @swagger
 * /api/distributor/packages/{packageId}/receive:
 *   patch:
 *     summary: Receive package at distribution center
 *     description: Transitions package status to DISTRIBUTOR_RECEIVED.
 *     tags: [Distributor]
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
 *                 example: Package arrived at Central Dispatch Hub.
 *               location:
 *                 type: string
 *                 example: Mumbai Regional Distribution Center
 *     responses:
 *       200:
 *         description: Package received at distributor hub
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
 *                   example: Package received at distributor hub
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
 *         description: Forbidden - Requires Distributor role
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
 * /api/distributor/packages/{packageId}/assign:
 *   patch:
 *     summary: Assign package to a delivery driver
 *     description: Assigns a delivery driver and transitions package status to ASSIGNED_FOR_DELIVERY.
 *     tags: [Distributor]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryPersonId
 *             properties:
 *               deliveryPersonId:
 *                 type: string
 *                 description: User ID of the delivery person
 *                 example: 662bfe1a8a2d123456789abc
 *               comments:
 *                 type: string
 *                 example: Assigned to morning delivery route.
 *               location:
 *                 type: string
 *                 example: Distribution Hub Loading Bay 4
 *     responses:
 *       200:
 *         description: Package successfully assigned
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
 *                   example: Package assigned to delivery person
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       400:
 *         description: Missing or invalid delivery person ID, or invalid state transition
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
 *         description: Forbidden - Requires Distributor role
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
router.patch('/packages/:packageId/assign', assignPackage);

module.exports = router;

