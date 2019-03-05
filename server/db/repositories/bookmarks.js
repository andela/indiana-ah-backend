import models from '../models/index';
import BaseRepository from './base';

/**
 *
 *
 * @class BookmarkRepository
 * @extends {BaseRepository}
 */
class BookmarkRepository extends BaseRepository {
  /**
   * Creates an instance of BookmarkRepository.
   *
   * @memberOf BookmarkRepository
   */
  constructor() {
    super(models.Bookmarks);
  }

  /**
   *
   *
   * @param {any} userId
   * @returns {Number} the number
   *
   * @memberOf BookmarkRepository
   */
  async findAndCountStats(userId) {
    try {
      const { count } = await this.findAndCountAll(userId);
      return count;
    } catch (error) {
      return error;
    }
  }
}
export default BookmarkRepository;
