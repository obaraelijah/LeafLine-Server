/**
 * Send a standardized JSON response to the client.
 *
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {boolean} success - Indicates whether the operation was successful.
 * @param {string} message - A message to include in the response.
 * @param {Object} [data] - Optional data to include in the response.
 * @returns {Object} - The response object sent to the client.
 *
 * This function generates a standardized JSON response to send to the client.
 * It allows you to specify the HTTP status code, success status, an optional message,
 * and optional data to include in the response.
 * If a message or data is not provided, it will be set to null in the response.
 * The response object conforms to the specified structure for consistency.
 */

function sendResponse(res, statusCode, success, message, data) {
  const response = {
    statusCode,
    success,
    message,
  };

  if (data !== undefined && data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  sendResponse,
};
  