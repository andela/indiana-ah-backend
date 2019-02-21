import { Op } from 'sequelize';
import Response from '../helpers/errorHelpers';
import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';
import paginator from '../helpers/paginator';

import ReadingStatistics from '../db/repositories/readingStats';
import ArticleRepsoitory from '../db/repositories/article';
import JWTHelper from '../helpers/jwtHelper';

const {
  Articles, Users, Comments, Reactions
} = models;
const { verifyToken } = JWTHelper;

const ReadingStatRepo = new ReadingStatistics();
const ArticleRepo = new ArticleRepsoitory();

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
      if (req.file) req.body.imageUrl = req.file.url;
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
          attributes: ['name', 'username', 'bio', 'imageUrl']
        },
        { model: Reactions }
      ];
      let articles = await paginator(Articles, req, includedModels);
      if (articles === undefined) return Response(res, 400, 'pagination error');
      if (!articles.length) return Response(res, 200, 'No articles found');
      articles = ArticleController.extractAllReactionsCount(articles, 'Reactions');
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
      const includedModels = [
        {
          model: Users,
          as: 'author',
          attributes: ['name', 'username', 'bio', 'imageUrl']
        },
        { model: Reactions }
      ];
      let articles = await paginator(Articles, req, includedModels, {
        userId
      });
      if (articles === undefined) return Response(res, 400, 'pagination error');
      if (!articles.length) return Response(res, 200, 'No articles found');
      articles = ArticleController.extractAllReactionsCount(articles, 'Reactions');
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
      if (req.file) req.body.imageUrl = req.file.url;
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
   *@description controller method for uploading article picture
   * @static
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next passes control to the next function
   * @returns {Object} a response object
   * @memberOf ArticleController class
   */
  static async updateArticlePicture(req, res, next) {
    try {
      const { slug } = req.params;
      await ArticleController.uploadPicture(req, res, Articles, { slug });
    } catch (error) {
      next(error);
    }
  }

  /**
   *@description controller method for removing article picture
   * @static
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {function} next passes control to the next function
   * @returns {Object} a response object
   * @memberOf ArticleController class
   */
  static async removeArticlePicture(req, res, next) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;
      const response = await Articles.update(
        {
          imageUrl: null
        },
        {
          where: { slug, userId },
          returning: true
        }
      );

      if (response[0] === 0) return Response(res, 404, 'Article not found');
      const article = response[1][0];
      return res.status(200).json({ message: 'Article Picture successfully removed', article });
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
      const token = req.header('x-auth-token');
      const decodedToken = verifyToken(token);
      const { id: userId } = decodedToken;
      const { slug } = req.params;
      if (!decodedToken) {
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
        if (!article) return Response(res, 404, 'Article not found');
        const timeToRead = ArticleController.calculateTimeToRead(article.articleBody);
        return res.status(200).json({ article, timeToRead });
      }
      let article = await Articles.findOne({
        where: { slug },
        include: [
          {
            model: Users,
            as: 'author',
            attributes: ['username', 'bio', 'imageUrl']
          },
          { model: Reactions }
        ]
      });
      if (!article) return Response(res, 404, 'Article not found');
      article = article.toJSON();
      ArticleController.getOneReactionsCount(article, 'Reactions');
      const timeToRead = ArticleController.calculateTimeToRead(article.articleBody);
      const userHasReadBefore = await ReadingStatRepo.checkStatForArticle({
        userId,
        articleId: article.dataValues.id
      });
      if (!userHasReadBefore) {
        await ArticleRepo.incremented({ id: article.dataValues.id }, 'numberOfReads');
        return ReadingStatRepo.create({ userId, articleId: article.dataValues.id });
      }
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
