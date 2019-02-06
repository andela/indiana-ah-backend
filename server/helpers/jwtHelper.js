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
    if (!token) return null;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decodedToken;
    } catch (e) {
      return e;
    }
  }
}

export default JWTHelper;
