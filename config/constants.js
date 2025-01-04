// config/constants.js
module.exports = {
  // Lead Status
  LEAD_STATUS: {
    NEW: "NEW",
    CONTACTED: "CONTACTED",
    QUALIFIED: "QUALIFIED",
    CONVERTING: "CONVERTING",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
  },

  // Business Types
  BUSINESS_TYPE: {
    RESTAURANT: "RESTAURANT",
    CAFE: "CAFE",
    CLOUD_KITCHEN: "CLOUD_KITCHEN",
    OTHER: "OTHER",
  },

  // Interaction Types
  INTERACTION_TYPE: {
    CALL: "CALL",
    EMAIL: "EMAIL",
    MEETING: "MEETING",
    OTHER: "OTHER",
  },

  // Interaction Outcomes
  INTERACTION_OUTCOME: {
    SUCCESSFUL: "SUCCESSFUL",
    FOLLOWUP_REQUIRED: "FOLLOWUP_REQUIRED",
    NO_RESPONSE: "NO_RESPONSE",
    NOT_INTERESTED: "NOT_INTERESTED",
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
  },

  // Contact Time Preferences
  CONTACT_TIME: {
    MORNING: "MORNING",
    AFTERNOON: "AFTERNOON",
    EVENING: "EVENING",
  },

  // Potential Value Levels
  POTENTIAL_VALUE: {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
    VALIDATION_ERROR: "Validation error",
    SERVER_ERROR: "Internal server error",
    DUPLICATE_ENTRY: "Duplicate entry",
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
  },
};
