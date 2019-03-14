import models from '../models/index';
import BaseRepository from './base';

/**
 *
 *
 * @class BookmarkRepository
 * @extends {BaseRepository}
 */
class CommentRepository extends BaseRepository {
  /**
   * Creates an instance of CommentRepository.
   *
   * @memberOf CommentRepository
   */
  constructor() {
    super(models.Comments);
  }

  /**
   *
   *
   * @param {any} userId
   * @returns {Number} the number
   *
   * @memberOf CommentRepository
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
export default CommentRepository;
