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
   * @param {any} details
   * @param {any} res
   * @returns {Object} this is the role of the user
   * @memberOf UserRepository
   */
  async role(details) {
    try {
      const result = await this.findOne(details);
      if (result === null) {
        return null;
      }
      const {
        dataValues: { role }
      } = result;
      return role;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {Object} whereClause
   * @param {string} colToUpdate
   * @param {Object} res
   * @returns {Object} the updated user
   *
   * @memberOf UserRepository
   */
  async updated(whereClause, colToUpdate) {
    try {
      const updated = await this.update(whereClause, colToUpdate);
      return updated;
    } catch (error) {
      return error;
    }
  }
}
export default UserRepository;
