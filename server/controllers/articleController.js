import errorResponse from '../helpers/errorHelpers';
import models from '../db/models';

const {
  Articles, Users, Comments, Reactions
} = models;

/**
 * @description A collection of controller methods for article CRUD operations
 * @class ArticleController
 */
class ArticleController {
  /**
   * @description controller method for creating an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async createArticle(req, res, next) {
    try {
      const { id: userId } = req.user;
      req.body.userId = userId;
      const article = await Articles.create(req.body);
      return res.status(201).json({ article });
    } catch (e) {
      return next(e);
    }
  }
}

export default ArticleController;
