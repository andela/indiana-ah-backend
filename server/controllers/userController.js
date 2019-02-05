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
   * @param {object} req
   * @param {object} res
   *
   * @memberOf User
   */
  static async registerUser(req, res) {
    const {
      name,
      username,
      email,
      password,
      bio,
      role,
      imageUrl,
      isVerified,
      subscribed
    } = req.body;
    try {
      const response = await Users.findOrCreate({
        where: { email },
        defaults: {
          name,
          username,
          password,
          bio,
          role,
          imageUrl,
          isVerified,
          subscribed
        }
      }).spread((user, created) => {
        if (user.get.id || !created) {
          return errorMessage(res, 400, 'this email or username already exists');
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
        .status(200)
        .json({
          message: 'successfully registered to authors haven'
        });
    } catch (e) {
      return errorMessage(res, 500, 'error in registration');
    }
  }
}

export default UserController;
