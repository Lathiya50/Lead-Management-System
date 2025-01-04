const constants = require("../config/constants");

exports.getPagination = (query) => {
  const page = parseInt(query.page, 10) || constants.PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(query.limit, 10) || constants.PAGINATION.DEFAULT_LIMIT,
    constants.PAGINATION.MAX_LIMIT
  );
  const startIndex = (page - 1) * limit;

  return {
    page,
    limit,
    startIndex,
  };
};
