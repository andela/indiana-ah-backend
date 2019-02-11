/* eslint-disable valid-jsdoc */
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import assignToken from '../helpers/assignJwtToken';
import errorMessage from '../helpers/errorHelpers';
import sendEmail from '../services/email';
import JWTHelper from '../helpers/jwtHelper';
import BaseHelper from '../helpers/baseHelper';

dotenv.config();
const { Users } = models;
const { verifyToken } = JWTHelper;
/**
 *
 *
 * @class UserController
 */
class UserController extends BaseHelper {
  /**
   * @description controller method for creating an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
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
        const url = '/api/v1/user/verify';
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
    const { token } = req.query;
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
      success: true,
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
      const {
        email: dbEmail, username, name, role, isVerified, id
      } = newUser;
      const decodedPassword = await newUser.validatePassword(password);
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
  static async getUserProfile(req, res) {
    const { username } = req.params;
    try {
      await Users.findOne({
        where: {
          username
        },
        attributes: ['name', 'username', 'email', 'bio', 'imageUrl', 'createdAt']
      }).then((user) => {
        if (!user) {
          return errorMessage(res, 404, 'User not found');
        }
        return res.status(200).json({
          profile: user.dataValues
        });
      });
    } catch (error) {
      errorMessage(res, 500, 'Internal server error');
    }
  }

  /**
   *
   * @static uploadUserPicture - the method that handles editing user picture
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
   */
  static async uploadUserPicture(req, res) {
    const image = {};
    const { id } = req.user;
    image.url = req.file.url;
    image.id = req.file.public_id;
    try {
      await Users.update(
        {
          imageUrl: image.url
        },
        {
          where: { id },
          returning: true
        }
      ).then(([updatedRows, [updatedUser]]) => {
        if (!updatedRows) {
          return errorMessage(res, 404, 'User not found');
        }
        return res.status(200).json({
          avatar: updatedUser.imageUrl
        });
      });
    } catch (error) {
      errorMessage(res, 500, 'Internal server error');
    }
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
  static async editUserProfile(req, res) {
    const { name, bio, password } = req.body;
    const user = req.params.username;
    const { id, username } = req.user;

    const profile = await Users.findOne({
      where: { id, username: user }
    });
    if (profile) {
      try {
        await Users.update(
          {
            name: name || profile.dataValues.name,
            username: username || profile.dataValues.username,
            bio: bio || profile.dataValues.bio,
            password: password || profile.dataValues.password
          },
          {
            where: { id },
            returning: true
          }
        ).then(([updatedRows, [updatedUser]]) => {
          UserController.checkIfDataExist(req, res, updatedRows, { message: 'User not found' });
          return res.status(200).json({
            profile: updatedUser
          });
        });
      } catch (error) {
        errorMessage(res, 500, 'Internal server error');
      }
    }
    return errorMessage(res, 404, 'User not found');
  }

  /**
   *
   * @static sendPasswordResetLink - method to send password reset link to user
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @returns {object} user - the user object
   * @memberOf UserController class
   */
  static async sendPasswordResetLink(req, res) {
    try {
      const { email } = req.body;
      const dbUser = await Users.findOne({
        where: { email },
        returning: true
      });
      UserController.checkIfDataExist(req, res, dbUser, { message: 'This email is not registered in our system' });
      const { id, username } = dbUser;
      // define token payload and duration
      const jwtKey = process.env.JWT_SECRET;
      const jwtDuration = { expiresIn: '1hrs' };
      const payload = {
        id,
        username,
        email
      };
      const token = assignToken(payload, jwtKey, jwtDuration);
      const location = req.get('host');
      const url = '/api/v1/user/passwordreset';
      // define sendEmail parameter list
      const link = UserController.generateEmailLink(location, url, token);
      const subject = 'Authors\' Haven password reset';
      const message = `<h1 style='color: Goldenrod' > Password Reset </h1><hr/>
      <p>Please reset your Author's Haven password with this 
      <a href=${link}>link</a>. This link will expire after <b>one hour</b></p>`;
      sendEmail(email, subject, message);
      return res.status(200).send({
        message: `password reset link sent to ${email}, please check your email`, token
      });
    } catch (error) {
      return errorMessage(res, 500, 'Server currently down');
    }
  }

  /**
   *
   *
   * @static getUserByEmail - the method that handles user password reset
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @returns {object} user - the user object
   * @memberOf UserController class
   */
  static async resetPassword(req, res) {
    const token = req.header('x-auth-token');
    const decodedToken = JWTHelper.verifyToken(token);
    if (!decodedToken) {
      return errorMessage(res, 401, 'This link is invalid or expired!!');
    }
    try {
      const { email } = decodedToken;
      const { password } = req.body;
      const response = await Users.update({ password }, {
        where: { email },
        returning: true
      });
      const updatedUser = response[1][0];
      return res.status(200).json({ message: 'Password reset successfully', updatedUser });
    } catch (resetError) {
      return errorMessage(res, 500, resetError);
    }
  }
}


export default UserController;
