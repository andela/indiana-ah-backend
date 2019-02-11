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
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for fetching all articles
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getAllArticles(req, res, next) {
    try {
      const articles = await Articles.findAll({
        include: [
          {
            model: Users,
            as: 'author',
            attributes: ['username', 'bio', 'imageUrl']
          },
          { model: Comments },
          { model: Reactions }
        ]
      });
      if (!articles[0]) return errorResponse(res, 404, 'No articles found');
      return res.status(200).json({ articles });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for fetching all articles for a particular user
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getAllUserArticles(req, res, next) {
    try {
      const { username } = req.params;
      const user = await Users.findOne({ where: { username } });
      if (!user) return errorResponse(res, 404, 'User not found');
      const { id: userId } = user;
      const articles = await Articles.findAll({
        where: { userId },
        include: [{ model: Comments }, { model: Reactions }]
      });
      if (!articles[0]) return errorResponse(res, 404, 'No articles found for user');
      return res.status(200).json({ articles });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for updating an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async updateArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;
      const response = await Articles.update(req.body, {
        where: { slug, userId },
        returning: true
      });

      if (response[0] === 0) return errorResponse(res, 404, 'Article requested for update not found');
      const article = response[1][0];
      return res.status(200).json({ message: 'Article successfully updated', article });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for fetching a single article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getOneArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        include: [
          {
            model: Users,
            as: 'author',
            attributes: ['username', 'bio', 'imageUrl']
          },
          { model: Comments },
          { model: Reactions }
        ]
      });
      if (!article) return errorResponse(res, 404, 'Article not found');
      return res.status(200).json({ article });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for deleting an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async deleteArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const response = await Articles.findOne({
        where: { slug }
      });
      if (!response) return errorResponse(res, 404, 'Article not found');
      await Articles.destroy({
        where: { slug }
      });
      return res.status(200).json({ message: 'Article successfully deleted' });
    } catch (error) {
      return next(error);
    }
  }
}

export default ArticleController;
