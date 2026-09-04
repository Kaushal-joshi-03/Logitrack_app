const Package = require('../models/Package');
const PackageHistory = require('../models/PackageHistory');
const { generatePackageId } = require('../utils/idGenerator');

// @desc    Create delivery request (Package)
// @route   POST /api/packages
// @access  Private (Client only)
exports.createPackage = async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      pickupAddress,
      receiverName,
      receiverPhone,
      deliveryAddress,
      originCity,
      destinationCity,
      description,
      packageType,
      weight,
      dimensions,
      priority,
      flowType
    } = req.body;

    const numWeight = Number(weight);
    if (weight === undefined || weight === null || isNaN(numWeight) || numWeight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid positive package weight in kg'
      });
    }

    // Generate atomic Package ID
    const packageId = await generatePackageId();

    const packageDoc = await Package.create({
      packageId,
      client: req.user._id,
      senderName: senderName ? senderName.trim() : req.user.name || 'Client',
      senderPhone: senderPhone ? senderPhone.trim() : '0000000000',
      pickupAddress: pickupAddress ? pickupAddress.trim() : 'Pickup Address',
      receiverName: receiverName ? receiverName.trim() : 'Receiver',
      receiverPhone: receiverPhone ? receiverPhone.trim() : '0000000000',
      deliveryAddress: deliveryAddress ? deliveryAddress.trim() : 'Delivery Address',
      originCity: originCity ? originCity.trim() : 'Delhi',
      destinationCity: destinationCity ? destinationCity.trim() : 'Mumbai',
      description: description || packageType || 'Standard Parcel',
      weight: Number(weight),
      dimensions: dimensions || { length: 10, width: 10, height: 10 },
      priority: priority || 'Standard',
      flowType: flowType || (priority === 'Express' || priority === 'Urgent' ? 'express' : 'standard'),
      status: 'REQUEST_CREATED'
    });

    // Create history entry
    await PackageHistory.create({
      package: packageDoc._id,
      packageId: packageDoc.packageId,
      status: 'REQUEST_CREATED',
      updatedBy: req.user._id,
      comments: 'Delivery request submitted by client.',
      location: originCity ? originCity.trim() : 'Origin'
    });

    res.status(201).json({
      success: true,
      message: 'Delivery request created successfully',
      data: packageDoc
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get client's own packages
// @route   GET /api/packages/my
// @access  Private (Client only)
exports.getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({ client: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Packages retrieved successfully',
      data: packages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Helper function to check package authorization
const checkPackageAccess = (pkg, user) => {
  if (user.role === 'admin' || user.role === 'warehouse' || user.role === 'distributor') {
    return true;
  }
  if (user.role === 'client') {
    const clientId = pkg.client && pkg.client._id ? pkg.client._id : pkg.client;
    return clientId && clientId.toString() === user._id.toString();
  }
  if (user.role === 'delivery' || user.role === 'delivery_person') {
    const driverId = pkg.assignedDeliveryPerson && pkg.assignedDeliveryPerson._id 
      ? pkg.assignedDeliveryPerson._id 
      : pkg.assignedDeliveryPerson;
    return driverId && driverId.toString() === user._id.toString();
  }
  return false;
};

// @desc    Get package by packageId (human readable ID)
// @route   GET /api/packages/:packageId
// @access  Private (All authenticated roles - with permissions check)
exports.getPackageDetails = async (req, res) => {
  try {
    const pkg = await Package.findOne({ packageId: req.params.packageId }).populate('client', 'name email');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    // Check authorization
    if (!checkPackageAccess(pkg, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this package'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package details retrieved',
      data: pkg
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get package history by packageId
// @route   GET /api/packages/:packageId/history
// @access  Private (All authenticated roles - with permissions check)
exports.getPackageHistory = async (req, res) => {
  try {
    const pkg = await Package.findOne({ packageId: req.params.packageId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${req.params.packageId}`
      });
    }

    // Check authorization
    if (!checkPackageAccess(pkg, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view the history for this package'
      });
    }

    const history = await PackageHistory.find({ package: pkg._id })
      .populate('updatedBy', 'name role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'Package history retrieved',
      data: history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get package by packageId for public tracking
// @route   GET /api/packages/public/track/:packageId
// @access  Public
exports.getPackageDetailsPublic = async (req, res) => {
  try {
    const rawId = req.params.packageId ? req.params.packageId.trim().toUpperCase() : '';
    if (!rawId) {
      return res.status(400).json({
        success: false,
        message: 'Package ID parameter is required'
      });
    }

    const pkg = await Package.findOne({ packageId: rawId });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package not found with ID ${rawId}`
      });
    }

    // Mask phone numbers and omit client email/account details for public privacy
    const maskPhone = (phone) => {
      if (!phone) return '••••••';
      const clean = String(phone).trim();
      return clean.length > 4 ? `••••••${clean.slice(-4)}` : '••••••';
    };

    const publicPkg = {
      _id: pkg._id,
      packageId: pkg.packageId,
      status: pkg.status,
      flowType: pkg.flowType,
      priority: pkg.priority,
      originCity: pkg.originCity,
      destinationCity: pkg.destinationCity,
      description: pkg.description,
      weight: pkg.weight,
      dimensions: pkg.dimensions,
      senderName: pkg.senderName,
      senderPhone: maskPhone(pkg.senderPhone),
      receiverName: pkg.receiverName,
      receiverPhone: maskPhone(pkg.receiverPhone),
      pickupAddress: pkg.pickupAddress,
      deliveryAddress: pkg.deliveryAddress,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Package details retrieved',
      data: publicPkg
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get package history by packageId for public tracking
// @route   GET /api/packages/public/track/:packageId/history
// @access  Public
exports.getPackageHistoryPublic = async (req, res) => {
  try {
    const pkg = await Package.findOne({ packageId: req.params.packageId.toUpperCase() });

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
      message: 'Package history retrieved',
      data: history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
