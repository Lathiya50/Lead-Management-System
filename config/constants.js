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
};
