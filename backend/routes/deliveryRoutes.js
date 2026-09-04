const express = require('express');
const router = express.Router();
const {
  getAssignedPackages,
  markOutForDelivery,
  markDelivered
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Last-mile delivery personnel operations (loading out-for-delivery and final delivery confirmation)
 */

// All routes are delivery only
router.use(protect, authorize('delivery', 'delivery_person'));

/**
 * @swagger
 * /api/delivery/packages:
 *   get:
 *     summary: Get packages assigned to the authenticated driver
 *     description: Retrieves active shipments assigned to the logged-in delivery person that have not yet been completed.
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned packages for the delivery person
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
 *                   example: Assigned packages retrieved
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
 *         description: Forbidden - Requires Delivery Person role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/packages', getAssignedPackages);

/**
 * @swagger
 * /api/delivery/packages/{packageId}/out-for-delivery:
 *   patch:
 *     summary: Mark package as out for delivery
 *     description: Transitions package status from ASSIGNED_FOR_DELIVERY to OUT_FOR_DELIVERY. Must be assigned to requesting driver.
 *     tags: [Delivery]
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
 *                 example: Package loaded in delivery van, out on delivery route.
 *               location:
 *                 type: string
 *                 example: Delivery Van #4
 *     responses:
 *       200:
 *         description: Package marked out for delivery
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
 *                   example: Package marked out for delivery
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
 *         description: Package is not assigned to the authenticated driver
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
router.patch('/packages/:packageId/out-for-delivery', markOutForDelivery);

/**
 * @swagger
 * /api/delivery/packages/{packageId}/deliver:
 *   patch:
 *     summary: Mark package as delivered
 *     description: Transitions package status from OUT_FOR_DELIVERY to DELIVERED. Must be assigned to requesting driver.
 *     tags: [Delivery]
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
 *                 example: Handed to receiver and signature confirmed.
 *               location:
 *                 type: string
 *                 example: Doorstep / Recipient Address
 *     responses:
 *       200:
 *         description: Package successfully marked as delivered
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
 *                   example: Package marked as delivered
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
 *         description: Package is not assigned to the authenticated driver
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
router.patch('/packages/:packageId/deliver', markDelivered);

module.exports = router;

