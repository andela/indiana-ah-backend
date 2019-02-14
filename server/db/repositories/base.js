/**
 *
 *
 * @class BaseRepository
 */
class BaseRepository {
  /**
   * Creates an instance of BaseRepository.
   * @param {any} models
   *
   * @memberOf BaseRepository
   */
  constructor(models) {
    this.models = models;
  }

  /**
   *
   *
   * @param {string} username
   * @param {Object} res
   * @returns {Object} returns the found user
   *
   * @memberOf BaseRepository
   */
  async findOne(username, res) {
    try {
      const model = await this.models.findOne({
        where: {
          username
        }
      });
      if (model === null) {
        return res.status(404).json({
          message: 'this user was not found'
        });
      }
      return model;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {any} username
   * @param {any} role
   * @param {any} res
   * @param {any} next
   * @return {Object} the updated user
   * @memberOf BaseRepository
   */
  async update(username, role, res) {
    try {
      const updatedRole = await this.models.update(
        { role },
        {
          where: { username },
          returning: true
        }
      );
      if (updatedRole) {
        return res.status(200).json({
          message: 'successfully updated user role',
          updatedUser: updatedRole[1][0].dataValues
        });
      }
    } catch (error) {
      return error;
    }
  }
}
export default BaseRepository;
