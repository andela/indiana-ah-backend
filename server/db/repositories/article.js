import BaseRespositories from './base';
import models from '../models/index';

/**
 *
 *
 * @class articleRepsoitory
 * @extends {BaseRespositories}
 */
class ArticleRepsoitory extends BaseRespositories {
  /**
   * Creates an instance of articleRepsoitory.
   *
   * @memberOf articleRepsoitory
   */
  constructor() {
    super(models.Articles);
  }

  /**
   *
   *
   * @param {String} articleId
   * @param {String} numberOfReads
   * @returns {Object} the incremented article
   *
   * @memberOf ArticleRepsoitory
   */
  async incremented(articleId, numberOfReads) {
    try {
      const result = await this.increment(articleId, numberOfReads);
      return result;
    } catch (error) {
      return error;
    }
  }
}
export default ArticleRepsoitory;
