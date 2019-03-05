import BaseRepository from './base';
import models from '../models/index';

/**
 *
 *
 * @class ReadingStatistics
 * @extends {BaseRepository}
 */
class ReadingStatistics extends BaseRepository {
  /**
   * Creates an instance of ReadingStatistics.
   *
   * @memberOf ReadingStatistics
   */
  constructor() {
    super(models.readingstatistics);
  }

  /**
   *
   *
   * @param {any} details
   * @returns {Object} the created reading statistic
   * @memberOf ReadingStatistics
   */
  async createStats(details) {
    try {
      const result = await this.create(details);
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {any} userId
   * @returns {Number} the number
   *
   * @memberOf ReadingStatistics
   */
  async findAndCountStats(userId) {
    try {
      const { count } = await this.findAndCountAll(userId);
      return count;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @param {any} details
   * @returns {Boolean} whether there is a reading statistic for the user
   *
   * @memberOf ReadingStatistics
   */
  async checkStatForArticle(details) {
    try {
      const result = await this.findOne(details);
      return result;
    } catch (error) {
      return error;
    }
  }
}
export default ReadingStatistics;
