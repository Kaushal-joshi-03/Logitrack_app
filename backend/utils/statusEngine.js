/**
 * Status Transition Matrix and Verification Engine
 * Defines valid transitions, required roles, and workflow constraints.
 */

const transitions = {
  REQUEST_CREATED: [
    { next: 'WAREHOUSE_RECEIVED', requiredRole: 'warehouse', flowType: 'standard' },
    { next: 'DISTRIBUTOR_RECEIVED', requiredRole: 'distributor', flowType: 'express' }
  ],
  WAREHOUSE_RECEIVED: [
    { next: 'PACKAGE_PROCESSED', requiredRole: 'warehouse', flowType: 'standard' }
  ],
  PACKAGE_PROCESSED: [
    { next: 'DISTRIBUTOR_RECEIVED', requiredRole: 'distributor', flowType: 'standard' }
  ],
  DISTRIBUTOR_RECEIVED: [
    { next: 'ASSIGNED_FOR_DELIVERY', requiredRole: 'distributor', flowType: 'any' }
  ],
  ASSIGNED_FOR_DELIVERY: [
    { next: 'OUT_FOR_DELIVERY', requiredRole: 'delivery_person', flowType: 'any' }
  ],
  OUT_FOR_DELIVERY: [
    { next: 'DELIVERED', requiredRole: 'delivery_person', flowType: 'any' }
  ],
  DELIVERED: [] // Terminal state
};

/**
 * Validates a package status transition.
 * 
 * @param {string} currentStatus - The current status of the package.
 * @param {string} targetStatus - The status to transition to.
 * @param {string} userRole - The role of the user attempting the transition.
 * @param {string} flowType - The flow type of the package ('standard' or 'express').
 * @returns {Object} { valid: boolean, message?: string }
 */
exports.validateTransition = (currentStatus, targetStatus, userRole, flowType) => {
  const allowed = transitions[currentStatus];
  
  if (!allowed) {
    return {
      valid: false,
      message: `Invalid current status '${currentStatus}'`
    };
  }

  const match = allowed.find(rule => 
    rule.next === targetStatus && 
    (rule.flowType === 'any' || rule.flowType === flowType)
  );

  if (!match) {
    return {
      valid: false,
      message: `Transition from '${currentStatus}' to '${targetStatus}' is not allowed for flow type '${flowType}'`
    };
  }

  const normalizedUserRole = (userRole === 'delivery_person' ? 'delivery' : (userRole || '').toLowerCase());
  const normalizedRequiredRole = (match.requiredRole === 'delivery_person' ? 'delivery' : (match.requiredRole || '').toLowerCase());

  if (normalizedRequiredRole !== normalizedUserRole && normalizedUserRole !== 'admin') {
    return {
      valid: false,
      message: `Transition to '${targetStatus}' requires role '${match.requiredRole}', but user has role '${userRole}'`
    };
  }

  return { valid: true };
};

exports.transitions = transitions;
