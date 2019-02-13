import BaseRepository from './base';
import models from '../models/index';

/**
 *
 *
 * @class UserRepository
 * @extends {BaseRepository}
 */
class UserRepository extends BaseRepository {
  /**
   * Creates an instance of UserRepository.
   *
   * @memberOf UserRepository
   */
  constructor() {
    super(models.Users);
  }

  /**
   *
   *
   * @param {any} username
   * @param {any} res
   * @returns {Object} this is the role of the user
   * @memberOf UserRepository
   */
  async role(username, res) {
    try {
      const {
        dataValues: { role }
      } = await this.findOne(username, res);
      return role;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {string} username
   * @param {string} role
   * @param {Object} res
   * @returns {Object} the updated user
   *
   * @memberOf UserRepository
   */
  async updated(username, role, res) {
    try {
      const updatedUser = await this.update(username, role, res);
      return updatedUser;
    } catch (error) {
      return error;
    }
  }
}
export default UserRepository;
