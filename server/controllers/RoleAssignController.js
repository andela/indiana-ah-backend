import errorMessage from '../helpers/errorHelpers';
import UserRepository from '../db/repositories/user';

const usersRepo = new UserRepository();
/**
 *
 *
 * @class RoleAssignController
 */
class RoleAssignController {
  /**
   *
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} it returns either the updated role of the user or an error
   *
   * @memberOf RoleAssignController
   */
  static async assignRole(req, res, next) {
    const { username, role } = req.body;
    const Allowedroles = ['admin', 'user'];
    if (Allowedroles.includes(role)) {
      try {
        const existingRole = await usersRepo.role({ username });
        if (existingRole === role) {
          return errorMessage(res, 400, `this user is already a/an ${role}`);
        }
        if (existingRole === null) {
          return errorMessage(res, 400, 'username not found');
        }
        const updatedUser = await usersRepo.updated(username, role);
        if (updatedUser) {
          return res.status(200).json({
            message: 'successfully updated user role',
            updatedUser: updatedUser[1][0].dataValues
          });
        }
        return errorMessage(res, 400, 'could not update user');
      } catch (error) {
        return next(error);
      }
    } else {
      return next(errorMessage(res, 403, 'this is not a permitted role'));
    }
  }
}
export default RoleAssignController;
