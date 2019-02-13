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
    try {
      const existingRole = await usersRepo.role(username, res);
      if (existingRole === role) {
        return errorMessage(res, 401, `this user is already an ${role}`);
      }
      await usersRepo.updated(username, role, res);
    } catch (error) {
      return next(error);
    }
  }
}
export default RoleAssignController;
