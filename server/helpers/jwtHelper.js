import jwt from 'jsonwebtoken';

/**
 * @description A collection of helper methods for JWT operations
 * @class JWTHelper
 */
class JWTHelper {
  /**
   * @description helper method for verifying a jwt token
   * @static
   * @param {String} token to be verified
   * @returns {Object} a user payload or an error
   */
  static verifyToken(token) {
    if (!token) return false;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decodedToken;
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return false;
    }
  }
}

export default JWTHelper;
