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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feat: implement get all articles feature

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
      if (articles.length === 0) return errorResponse(res, 404, 'No articles found');
      return res.status(200).json({ articles });
    } catch (e) {
      return next(e);
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feat implement update an article feature

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
    } catch (e) {
      return next(e);
    }
  }
<<<<<<< HEAD

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
    } catch (e) {
      return next(e);
    }
  }
=======
>>>>>>> feat: implement create an article feature
=======
>>>>>>> feat: implement get all articles feature
=======
>>>>>>> feat implement update an article feature
}

export default ArticleController;
