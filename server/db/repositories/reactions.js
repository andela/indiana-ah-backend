import models from '../models/index';
import BaseRepository from './base';

/**
 *
 *
 * @class ReactionRepository
 * @extends {BaseRepository}
 */
class ReactionRepository extends BaseRepository {
  /**
   * Creates an instance of ReactionRepository.
   *
   * @memberOf ReactionRepository
   */
  constructor() {
    super(models.Reactions);
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
    let likes = 0;
    let dislikes = 0;
    try {
      const { count, rows } = await this.findAndCountAll(userId);
      rows.map((row) => {
        if (row.dataValues.reactionType === 'like') {
          likes += 1;
          return likes;
        }
        dislikes += 1;
        return dislikes;
      });
      return { count, likes, dislikes };
    } catch (error) {
      return error;
    }
  }
}
export default ReactionRepository;
