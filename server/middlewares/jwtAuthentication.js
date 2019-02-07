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
<<<<<<< HEAD
<<<<<<< HEAD
          'Access denied. You are not authorized to access this route'
        );
      }
      if (!decodedToken.isVerified) return errorResponse(res, 403, 'Access denied. You are not a verified user');
      req.user = decodedToken;
=======
          'Access denied. You are not authorized to acceess this route'
        );
      }
      if (!decodedToken.isVerfied) return errorResponse(res, 403, 'Access denied. You are not a verified user');
<<<<<<< HEAD
>>>>>>> feat: implement create an article feature
=======
=======
          'Access denied. You are not authorized to access this route'
        );
      }
      if (!decodedToken.isVerified) return errorResponse(res, 403, 'Access denied. You are not a verified user');
>>>>>>> feat: writes test for article crud operations
      req.user = decodedToken;
>>>>>>> feat: implement get a single article feature
      next();
    } catch (e) {
      return next(e);
    }
  }
}

export default Auth;
