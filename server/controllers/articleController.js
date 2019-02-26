import { Op } from 'sequelize';
import Response from '../helpers/errorHelpers';
import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';
import paginator from '../helpers/paginator';

const {
  Articles, Users, Comments, Reactions, CommentReactions, CommentEditHistories
} = models;

/**
 * @description A collection of controller methods for article CRUD operations
 * @class ArticleController
 */
class ArticleController extends BaseHelper {
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
      const userArticle = req.body.articleBody;
      const timeToRead = ArticleController.calculateTimeToRead(userArticle);
      const article = await Articles.create(req.body);
      return res.status(201).json({ article, timeToRead });
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
      const includedModels = [
        {
          model: Users,
          as: 'author',
          attributes: ['username', 'bio', 'imageUrl']
        },
        { model: Comments },
        { model: Reactions }
      ];
      const articles = await paginator(Articles, req, includedModels);
      if (articles === undefined) return Response(res, 400, 'pagination error');
      if (!articles.length) return Response(res, 200, 'No articles found');
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
      if (!user) return Response(res, 404, 'User not found');
      const { id: userId } = user;
      const includedModels = [{ model: Comments }, { model: Reactions }];
      const articles = await paginator(Articles, req, includedModels, {
        userId
      });
      if (articles === undefined) return Response(res, 400, 'pagination error');
      if (!articles.length) return Response(res, 200, 'No articles found');
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

      if (response[0] === 0) return Response(res, 404, 'Article requested for update not found');
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
      let article = await Articles.findOne({
        where: { slug },
        include: [
          {
            model: Users,
            as: 'author',
            attributes: ['username', 'bio', 'imageUrl']
          },
          {
            model: Comments,
            include: [{ model: CommentReactions }, { model: CommentEditHistories }]
          },
          { model: Reactions }
        ]
      });
      if (!article) return errorResponse(res, 404, 'Article not found');
      article = article.toJSON();
      ArticleController.getReactions(article, 'Reactions');
      article.Comments = ArticleController.getCommentReactions(article.Comments);
      const timeToRead = ArticleController.calculateTimeToRead(article.articleBody);
      return res.status(200).json({ article, timeToRead });
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
      if (!response) return Response(res, 404, 'Article not found');
      await Articles.destroy({
        where: { slug }
      });
      return res.status(200).json({ message: 'Article successfully deleted' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for searching/filtering articles
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async searchArticles(req, res, next) {
    try {
      const {
        author, title, tag, q
      } = req.query;

      let queryCondition = {};

      if (q) {
        queryCondition = {
          [Op.or]: [
            { articleBody: { [Op.iLike]: `%${q}%` } },
            { articleTitle: { [Op.iLike]: `%${q}%` } },
            { '$author.username$': { [Op.iLike]: `%${q}%` } },
            { '$author.name$': { [Op.iLike]: `%${q}%` } },
            { tags: { [Op.iLike]: `%${q}%` } }
          ]
        };
      } else {
        const conditions = {
          author: {
            [Op.or]: [
              { '$author.username$': { [Op.iLike]: `%${author}%` } },
              { '$author.name$': { [Op.iLike]: `%${author}%` } }
            ]
          },
          title: { articleTitle: { [Op.iLike]: `%${title}%` } },
          tag: { tags: { [Op.iLike]: `%${tag}%` } }
        };

        Object.entries(conditions).forEach(([key, value]) => {
          if (req.query[key]) Object.assign(queryCondition, value);
        });
      }

      if (
        !Object.keys(queryCondition).length
        && !Object.getOwnPropertySymbols(queryCondition).length
      ) return Response(res, 400, 'Invalid search parameter');

      await ArticleController.search(req, res, queryCondition);
    } catch (error) {
      return next(error);
    }
  }
}

export default ArticleController;
