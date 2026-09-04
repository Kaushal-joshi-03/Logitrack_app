const User = require('../models/User');
const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all packages
// @route   GET /api/admin/packages
// @access  Private (Admin only)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('client', 'name email')
      .populate('assignedDeliveryPerson', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All packages retrieved successfully',
      data: packages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get history for any package by packageId
// @route   GET /api/admin/packages/:packageId/history
// @access  Private (Admin only)
exports.getPackageHistory = async (req, res) => {
  try {
    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    const history = await PackageHistory.find({ package: pkg._id })
      .populate('updatedBy', 'name role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: `History for package ${req.params.packageId} retrieved`,
      data: history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
