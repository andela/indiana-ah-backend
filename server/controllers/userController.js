/* eslint-disable valid-jsdoc */
import models from '../db/models';
import assignToken from '../helpers/assignJwtToken';
import errorMessage from '../helpers/errorHelpers';

const { Users } = models;

/**
 *
 *
 * @class User
 */
class UserController {
  /**
   *
   *
   * @static
   * @param {object} req - the request object
   * @param {object} res - the response object
   *
   * @memberOf User
   */
  static async registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
      const response = await Users.findOrCreate({
        where: { email },
        defaults: {
          username,
          password
        }
      }).spread((user, created) => {
        if (!created) {
          return errorMessage(res, 409, 'this email or username already exists');
        }
        return user.get({
          plain: true
        });
      });
      const payload = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role
      };
      const token = assignToken(payload);
      return res
        .header('x-auth-token', token)
        .status(201)
        .json({
          message: 'successfully registered to authors haven'
        });
    } catch (e) {
      return errorMessage(res, 500, 'error in registration');
    }
  }
}

export default UserController;
