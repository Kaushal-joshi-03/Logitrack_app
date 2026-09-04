const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');
const { validateTransition } = require('../utils/statusEngine');

// Helper to check assignment
const verifyDriverAssignment = (pkg, driverId) => {
  return pkg.assignedDeliveryPerson && pkg.assignedDeliveryPerson.toString() === driverId.toString();
};

// @desc    Get packages assigned to logged-in delivery person (not delivered yet)
// @route   GET /api/delivery/packages
// @access  Private (Delivery Person only)
exports.getAssignedPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      assignedDeliveryPerson: req.user._id,
      status: { $ne: 'DELIVERED' }
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Assigned packages retrieved',
      data: packages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Mark package out for delivery
// @route   PATCH /api/delivery/packages/:packageId/out-for-delivery
// @access  Private (Delivery Person only)
exports.markOutForDelivery = async (req, res) => {
  try {
    const { comments, location } = req.body;
    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    // Verify assignment
    if (!verifyDriverAssignment(pkg, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This package is not assigned to you'
      });
    }

    const validation = validateTransition(
      pkg.status,
      'OUT_FOR_DELIVERY',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'OUT_FOR_DELIVERY';
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'OUT_FOR_DELIVERY',
      updatedBy: req.user._id,
      comments: comments || 'Package loaded into delivery vehicle, out for delivery.',
      location: location || 'Delivery Transit'
    });

    res.status(200).json({
      success: true,
      message: 'Package marked out for delivery',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Mark package delivered
// @route   PATCH /api/delivery/packages/:packageId/deliver
// @access  Private (Delivery Person only)
exports.markDelivered = async (req, res) => {
  try {
    const { comments, location } = req.body;
    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    // Verify assignment
    if (!verifyDriverAssignment(pkg, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This package is not assigned to you'
      });
    }

    const validation = validateTransition(
      pkg.status,
      'DELIVERED',
      req.user.role,
      pkg.flowType
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    pkg.status = 'DELIVERED';
    await pkg.save();

    await PackageHistory.create({
      package: pkg._id,
      packageId: pkg.packageId,
      status: 'DELIVERED',
      updatedBy: req.user._id,
      comments: comments || 'Package successfully delivered and signed.',
      location: location || 'Final Destination'
    });

    res.status(200).json({
      success: true,
      message: 'Package marked as delivered',
      data: pkg
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
