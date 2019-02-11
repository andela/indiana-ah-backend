/* eslint-disable valid-jsdoc */
import { Op } from 'sequelize';
import models from '../db/models';
import assignToken from '../helpers/assignJwtToken';
import errorMessage from '../helpers/errorHelpers';
import sendEmail from '../services/email';
import JWTHelper from '../helpers/jwtHelper';
import BaseHelpers from '../helpers/baseHelpers';

const { Users } = models;
const { verifyToken } = JWTHelper;
/**
 *
 *
 * @class UserController
 */
class UserController {
  /**
   *
   *
   * @static registerUser - the method that handles user registration
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf UserController class
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
        const link = `${location}/api/v1/user/verify?token=${token}`;
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
   * @param {any} req - the request object from the body
   * @param {any} res - the response object sent back to the client
   *
   * @memberOf UserController
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
          if (!updatedRows) {
            return errorMessage(res, 404, 'User not found');
          }
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
   *
   * @static handleSocialAuth - the method that handles social authentication
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {string} profile
   * @param {function} done
   *
   * @memberOf UserController class
   */
  static async handleSocialAuth(accessToken, refreshToken, profile, done) {
    const userPassword = await BaseHelpers.hashPassword(profile.id);
    try {
      const [user] = await Users.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          name: profile.displayName,
          username: profile.displayName.split(' ')[0].concat(profile.id),
          password: userPassword,
          imageUrl: profile.photos[0].value,
          isVerified: true
        }
      });
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
}

export default UserController;
