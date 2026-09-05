const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to normalize role
const normalizeRole = (r) => {
  if (!r) return 'client';
  const lower = String(r).toLowerCase().trim();
  if (lower === 'delivery_person') return 'delivery';
  return lower;
};

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, role)'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanRole = normalizeRole(role);
    const validRoles = ['client', 'warehouse', 'distributor', 'delivery', 'admin'];
    if (!validRoles.includes(cleanRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: cleanRole
    });

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role)
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userObj,
      data: userObj
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Registration failed'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check for user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify role match if role was specified
    if (role) {
      const selectedRoleNorm = normalizeRole(role);
      const userRoleNorm = normalizeRole(user.role);
      if (selectedRoleNorm !== userRoleNorm) {
        const formattedRole = String(role).charAt(0).toUpperCase() + String(role).slice(1);
        return res.status(403).json({
          success: false,
          message: `These credentials are not registered under the ${formattedRole} role. Please select the correct role or check your credentials.`
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);
    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role)
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userObj,
      data: {
        token,
        user: userObj
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Authentication error'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const userObj = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: normalizeRole(req.user.role)
    };

    res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      user: userObj,
      data: userObj
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Profile retrieval error'
    });
  }
};

// @desc    Forgot/reset password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // In production, avoid user enumeration by always returning a generic response
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.'
      });
    }

    // Secure implementation: do not allow arbitrary unauthenticated password overwrite.
    // Return standard dispatch confirmation
    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been dispatched.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Password reset request could not be processed at this time.'
    });
  }
};
