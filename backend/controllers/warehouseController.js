const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');
const { validateTransition } = require('../utils/statusEngine');

// @desc    Get warehouse actionable packages
// @route   GET /api/warehouse/packages
// @access  Private (Warehouse only)
exports.getWarehousePackages = async (req, res) => {
  try {
    // Actionable packages for warehouse: 
    // 1. REQUEST_CREATED (but only if flowType is standard - express bypasses warehouse)
    // 2. WAREHOUSE_RECEIVED
    const packages = await Package.find({
      $or: [
        { status: 'REQUEST_CREATED', flowType: 'standard' },
        { status: 'WAREHOUSE_RECEIVED' }
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Warehouse packages retrieved',
      data: packages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Receive package at warehouse
// @route   PATCH /api/warehouse/packages/:packageId/receive
// @access  Private (Warehouse only)
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
      'WAREHOUSE_RECEIVED',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'WAREHOUSE_RECEIVED';
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'WAREHOUSE_RECEIVED',
      updatedBy: req.user._id,
      comments: comments || 'Package received at warehouse facility.',
      location: location || 'Warehouse Intake'
    });

    res.status(200).json({
      success: true,
      message: 'Package received at warehouse',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Process package at warehouse
// @route   PATCH /api/warehouse/packages/:packageId/process
// @access  Private (Warehouse only)
exports.processPackage = async (req, res) => {
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
      'PACKAGE_PROCESSED',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'PACKAGE_PROCESSED';
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'PACKAGE_PROCESSED',
      updatedBy: req.user._id,
      comments: comments || 'Package processed, sorted, and packed.',
      location: location || 'Warehouse Sorting Floor'
    });

    res.status(200).json({
      success: true,
      message: 'Package processed at warehouse',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
