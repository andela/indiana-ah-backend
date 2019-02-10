/* eslint-disable valid-jsdoc */
import { Op } from 'sequelize';
import models from '../db/models';
import assignToken from '../helpers/assignJwtToken';
import errorMessage from '../helpers/errorHelpers';

const { Users } = models;
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
      }).spread(
        (
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
          return res
            .header('x-auth-token', token)
            .status(201)
            .json({
              message: 'successfully registered to authors haven',
              token
            });
        }
      );
    } catch (e) {
      return errorMessage(res, 500, 'internal server error');
    }
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
}

export default UserController;
