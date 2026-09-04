const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');
const User = require('../models/User');
const { validateTransition } = require('../utils/statusEngine');

// @desc    Get distributor actionable packages
// @route   GET /api/distributor/packages
// @access  Private (Distributor only)
exports.getDistributorPackages = async (req, res) => {
  try {
    // Actionable packages for distributor:
    // 1. PACKAGE_PROCESSED (standard flow processed at warehouse)
    // 2. REQUEST_CREATED (express flow bypassing warehouse)
    // 3. DISTRIBUTOR_RECEIVED (ready to assign)
    const packages = await Package.find({
      $or: [
        { status: 'PACKAGE_PROCESSED' },
        { status: 'REQUEST_CREATED', flowType: 'express' },
        { status: 'DISTRIBUTOR_RECEIVED' }
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Distributor packages retrieved',
      data: packages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Receive package at distributor hub
// @route   PATCH /api/distributor/packages/:packageId/receive
// @access  Private (Distributor only)
exports.receivePackage = async (req, res) => {
  try {
    const { comments, location } = req.body;
    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    const validation = validateTransition(
      pkg.status,
      'DISTRIBUTOR_RECEIVED',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'DISTRIBUTOR_RECEIVED';
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'DISTRIBUTOR_RECEIVED',
      updatedBy: req.user._id,
      comments: comments || 'Package received at distribution hub.',
      location: location || 'Distribution Hub Reception'
    });

    res.status(200).json({
      success: true,
      message: 'Package received at distributor hub',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Assign package to delivery person
// @route   PATCH /api/distributor/packages/:packageId/assign
// @access  Private (Distributor only)
exports.assignPackage = async (req, res) => {
  try {
    const { deliveryPersonId, comments, location } = req.body;

    if (!deliveryPersonId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deliveryPersonId'
      });
    }

    // Verify delivery person exists and has correct role
    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson || !['delivery', 'delivery_person'].includes(deliveryPerson.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery person ID or user is not a delivery person'
      });
    }

    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    const validation = validateTransition(
      pkg.status,
      'ASSIGNED_FOR_DELIVERY',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'ASSIGNED_FOR_DELIVERY';
    pkg.assignedDeliveryPerson = deliveryPersonId;
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'ASSIGNED_FOR_DELIVERY',
      updatedBy: req.user._id,
      comments: comments || `Package assigned to driver ${deliveryPerson.name}.`,
      location: location || 'Distribution Dispatch'
    });

    res.status(200).json({
      success: true,
      message: 'Package assigned to delivery person',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all delivery drivers
// @route   GET /api/distributor/drivers
// @access  Private (Distributor only)
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: { $in: ['delivery', 'delivery_person'] } }).select('name email');
    res.status(200).json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: drivers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
