import JWTHelper from '../helpers/jwtHelper';
import errorResponse from '../helpers/errorHelpers';

const { verifyToken } = JWTHelper;

/**
 * @description a collection of middlewares for user/admin authentication and authorisation
 * @class Auth
 */
class Auth {
  /**
   * @description middleware for authenticating and authorising a user
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Function} next passes control to the next middleware or route handler
   * @returns {Object} a response object
   */
  static authUser(req, res, next) {
    try {
      const token = req.header('x-auth-token');
      const decodedToken = verifyToken(token);
      if (
        !decodedToken
        || decodedToken.name === 'JsonWebTokenError'
        || decodedToken.name === 'TokenExpiredError'
      ) {
        return errorResponse(
          res,
          401,
          'Access denied. You are not authorized to acceess this route'
        );
      }
      if (!decodedToken.isVerfied) return errorResponse(res, 403, 'Access denied. You are not a verified user');
      req.user = decodedToken;
      next();
    } catch (e) {
      return next(e);
    }
  }
}

export default Auth;
