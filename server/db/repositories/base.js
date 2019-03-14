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
   * @param {string} details
   * @returns {Object} returns the found user
   *
   * @memberOf BaseRepository
   */
  async findOne(details) {
    try {
      const model = await this.models.findOne({
        where: details
      });
      if (model === null) {
        return null;
      }
      return model;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {Object} whereClause
   * @param {Object} colToUpdate
   * @return {Object} the updated user
   * @memberOf BaseRepository
   */
  async update(whereClause, colToUpdate) {
    try {
      const updated = await this.models.update(colToUpdate, {
        where: whereClause,
        returning: true
      });
      if (!updated) {
        return null;
      }
      return updated;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {Object} whereClause
   * @param {String} colToUpdate
   * @returns {Object} the article with incremented reads
   *
   * @memberOf BaseRepository
   */
  async increment(whereClause, colToUpdate) {
    try {
      const incremented = await this.models.increment(colToUpdate, {
        where: whereClause,
        returning: true
      });
      if (!incremented) {
        return null;
      }
      return incremented[0][0][0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {any} details
   * @returns {Object} the created object
   *
   * @memberOf BaseRepository
   */
  async create(details) {
    try {
      const created = await this.models.create(details);
      return created;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {Number} userId
   * @param {Array} includedModels
   * @returns {String} the count of the user in this model
   *
   * @memberOf BaseRepository
   */
  async findAndCountAll(userId, includedModels) {
    try {
      const result = await this.models.findAndCountAll({
        where: { userId },
        include: includedModels
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}
export default BaseRepository;
