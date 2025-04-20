/**
 * Wraps an async function to handle errors automatically
 * This eliminates the need for try/catch blocks in route handlers
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};