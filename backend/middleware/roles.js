// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const rawUserRole = (req.user.role || '').toLowerCase().trim();
    const userRole = rawUserRole === 'delivery_person' ? 'delivery' : rawUserRole;

    const normalizedAllowedRoles = roles.map(r => {
      const lower = String(r).toLowerCase().trim();
      return lower === 'delivery_person' ? 'delivery' : lower;
    });

    if (!normalizedAllowedRoles.includes(userRole) && !normalizedAllowedRoles.includes('admin')) {
      // Also allow if admin is requested or user is admin
      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: `User role '${req.user.role}' is not authorized to access this route`
        });
      }
    }
    next();
  };
};
