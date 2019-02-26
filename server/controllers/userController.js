/* eslint-disable valid-jsdoc */
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import assignToken from '../helpers/assignJwtToken';
import errorMessage from '../helpers/errorHelpers';
import sendEmail from '../services/email';
import JWTHelper from '../helpers/jwtHelper';
import BaseHelper from '../helpers/baseHelper';
import paginator from '../helpers/paginator';

dotenv.config();
const { Users, Articles } = models;
const { verifyToken } = JWTHelper;
/**
 *
 *
 * @class UserController
 */
class UserController extends BaseHelper {
  /**
   * @description controller method for creating a user
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {Object} a response object
   */
  static async registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
      await Users.findOrCreate({
        where: {
          [Op.or]: [{ email }, { username }]
        },
        defaults: {
          email,
          username,
          password
        }
      }).spread((
        {
          _options: { isNewRecord },
          dataValues: {
            username: dbUsername, email: dbEmail, id, role
          }
        },
        created
      ) => {
        if (!created && !isNewRecord && dbEmail === email) {
          return errorMessage(res, 409, 'this email already exists');
        }
        if (!created && !isNewRecord && dbUsername === username) {
          return errorMessage(res, 409, 'this username already exists');
        }
        const payload = {
          id,
          username: dbUsername,
          email: dbEmail,
          role
        };
        const token = assignToken(payload);
        const location = req.get('host');
        const url = '/api/v1/users/verify';
        const link = UserController.generateEmailLink(location, url, token);
        const message = `<h1 style='color: Goldenrod' > Welcome to Author's Haven</h1><hr/>
          <p>Please click this link to verify your Author's Haven account
          <a href=${link}>link</a></p>`;
        sendEmail(email, 'Verify your Author\'s haven account', message);
        return res
          .header('x-auth-token', token)
          .status(201)
          .json({
            message:
                'Successfully registered to Authors haven. Kindly check your email to verify your account',
            token
          });
      });
    } catch (error) {
      return errorMessage(res, 500, 'internal server error');
    }
  }

  /**
   *
   *
   * @static verifyUser - the method that handles user verification
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async verifyUser(req, res) {
    const { query: token } = req.query;
    const decodedToken = verifyToken(token);
    if (decodedToken.name === 'JsonWebTokenError' || decodedToken.name === 'TokenExpiredError') {
      return errorMessage(res, 401, 'Access denied. You are not authorized to acceess this route');
    }
    const user = await Users.update(
      {
        isVerified: true
      },
      { where: { id: decodedToken.id }, returning: true }
    );

    const {
      id, username, email, isVerified, role
    } = user[1][0];
    const payload = {
      id,
      username,
      email,
      role,
      isVerified
    };
    const newToken = assignToken(payload);
    return res.status(200).json({
      message: 'User Successfully Verified',
      data: user[1][0],
      token: newToken
    });
  }

  /**
   *
   *
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const newUser = await Users.findOne({
        where: { email },
        attributes: ['name', 'username', 'email', 'password', 'role', 'isVerified', 'id']
      });
      UserController.checkIfDataExist(res, newUser, { message: 'error logging in' });
      const {
        email: dbEmail, username, name, role, isVerified, id
      } = newUser;

      const { password: dbPassword } = newUser.dataValues;
      const decodedPassword = UserController.validatePassword(password, dbPassword);

      if (dbEmail && decodedPassword) {
        const payload = {
          email: dbEmail,
          username,
          name,
          role,
          isVerified,
          id
        };
        const token = assignToken(payload);
        return res
          .header('x-auth-token', token)
          .status(200)
          .json({
            message: 'successfully logged in',
            token
          });
      }
      return errorMessage(res, 401, 'error logging in');
    } catch (error) {
      return errorMessage(res, 500, 'internal server error');
    }
  }

  /**
   *
   *
   * @static getUserProfile - the method that handles getting user profile
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async getUserProfile(req, res, next) {
    const { username } = req.params;
    try {
      const user = await Users.findOne({
        where: {
          username
        },
        attributes: ['name', 'username', 'email', 'bio', 'imageUrl', 'createdAt']
      });
      if (user) {
        return res.status(200).json({
          profile: user.dataValues
        });
      }
      return res.status(404).json({
        message: 'User not found'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static getAllUsersProfile - the method that handles getting all users profile
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async getAllUsersProfile(req, res, next) {
    try {
      const includedModels = [{ model: Articles }];
      const profiles = await paginator(Users, req, includedModels);
      if (!profiles) {
        return res.status(200).json('There are no users to display');
      }
      return res.status(200).json({ profiles });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static uploadUserPicture - the method that handles editing user picture
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async uploadUserPicture(req, res, next) {
    const { id } = req.user;
    UserController.uploadPicture(req, res, Users, { id }, next);
  }

  /**
   *
   *
   * @static updatePassword - the method that handles updating user password
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async updatePassword(req, res, next) {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await UserController.checkIfExists(username);

    if (user) {
      const { password: dbPassword } = user.dataValues;
      const samePassword = await UserController.validatePassword(currentPassword, dbPassword);

      try {
        if (samePassword) {
          const updatedUser = await Users.update(
            {
              password: newPassword
            },
            {
              where: { username },
              returning: true
            }
          );
          const updatedRows = updatedUser[0];

          if (updatedRows) {
            return res.status(200).json({
              message: 'Password successfully updated'
            });
          }
        }
        return errorMessage(res, 401, 'Error updating password');
      } catch (error) {
        next(error);
      }
    }
    return errorMessage(res, 404, 'User not found');
  }

  /**
   *
   *
   * @static editUserProfile - the method that handles editing a user profile
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async editUserProfile(req, res, next) {
    const {
      name, bio, username
    } = req.body;
    const user = req.params.username;
    const foundUsername = await UserController.checkIfExists(username);

    if (!foundUsername) {
      const profile = await UserController.checkIfExists(user);
      if (profile) {
        try {
          const updatedUser = await Users.update(
            {
              name: name || profile.dataValues.name,
              username: username || profile.dataValues.username,
              bio: bio || profile.dataValues.bio,
            },
            {
              where: { username: user },
              returning: true
            }
          );
          const updatedRows = updatedUser[0];
          const updatedUserValues = updatedUser[1][0].dataValues;

          UserController.checkIfDataExist(res, updatedRows, 'User not found');
          return res.status(200).json({
            profile: {
              name: updatedUserValues.name,
              username: updatedUserValues.username,
              bio: updatedUserValues.bio,
              createdAt: updatedUserValues.createdAt
            }
          });
        } catch (error) {
          return next(error);
        }
      }
      return errorMessage(res, 404, 'User not found');
    }
    return errorMessage(res, 409, 'This username already exists');
  }

  /**
   *
   *
   * @static deleteUserProfile - the method that handles deleting a user profile
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async deleteUserProfile(req, res, next) {
    const user = req.params.username;

    try {
      const response = await Users.findOne({
        where: { username: user }
      });
      if (!response) return errorMessage(res, 404, 'User not found');
      await Users.destroy({
        where: { username: user },
      });
      return res.status(200).json({ message: 'Profile successfully deleted' });
    } catch (error) {
      return next(error);
    }
  }


  /**
   *
   *
   * @static handleSocialAuth - the method that saves socially /
   * authenticated user's data into the database
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {string} profile
   * @param {function} done
   *
   * @memberOf UserController class
   */
  static async handleSocialAuth(accessToken, refreshToken, profile, done) {
    const {
      id, emails, displayName, photos
    } = profile;

    try {
      const [user] = await Users.findOrCreate({
        where: { email: emails[0].value },
        defaults: {
          name: displayName,
          username: displayName.split(' ')[0].concat(id),
          password: id,
          imageUrl: photos[0].value,
          isVerified: true
        }
      });
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  /**
   *
   * @static sendPasswordResetLink - method to send password reset link to user
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next Function to pass control to the next item
   * @returns {object} user - the user object
   * @memberOf UserController class
   */
  static async sendPasswordResetLink(req, res, next) {
    try {
      const { email } = req.body;
      const dbUser = await Users.findOne({
        where: { email },
        returning: true
      });
      UserController.checkIfDataExist(res, dbUser, {
        message: 'This email is not registered in our system'
      });
      const { id, username } = dbUser;
      // define token payload and duration
      const jwtKey = process.env.JWT_SECRET_KEY;
      const jwtDuration = { expiresIn: '1hrs' };
      const payload = {
        id,
        username,
        email
      };
      const token = assignToken(payload, jwtKey, jwtDuration);
      const location = req.get('host');
      const url = '/api/v1/users/reset-password';
      // define sendEmail parameter list
      const link = UserController.generateEmailLink(location, url, token);
      const subject = 'Authors\' Haven password reset';
      const message = `<h1 style='color: Goldenrod' > Password Reset </h1><hr/>
      <p>Please reset your Author's Haven password with this 
      <a href=${link}>link</a>. This link will expire after <b>one hour</b></p>`;
      sendEmail(email, subject, message);
      return res.status(200).send({
        message: `password reset link sent to ${email}, please check your email`,
        token
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @description Redirects socially authenticated users and returns a token
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} Json Resonse
   * @memberof UserController
   */
  static async socialAuthRedirect(req, res) {
    const {
      username, email, name, role, isVerified
    } = req.user.dataValues;
    const payload = {
      email,
      username,
      name,
      role,
      isVerified
    };
    const token = assignToken(payload);
    return res.redirect(`/?token=${token}`);
  }

  /**
   *
   *
   * @static getUserByEmail - the method that handles user password reset
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next Function to pass control to the next item
   * @returns {object} user - the user object
   * @memberOf UserController class
   */
  static async resetPassword(req, res, next) {
    const token = req.header('x-auth-token');
    const decodedToken = JWTHelper.verifyToken(token);
    if (!decodedToken) {
      return errorMessage(res, 401, 'This link is invalid or expired!!');
    }
    try {
      const { email } = decodedToken;
      const { password } = req.body;
      const response = await Users.update(
        { password },
        {
          where: { email },
          returning: true
        }
      );
      const updatedUser = response[1][0];
      return res.status(200).json({ message: 'Password reset successfully', updatedUser });
    } catch (resetError) {
      return next(resetError);
    }
  }
}

export default UserController;
