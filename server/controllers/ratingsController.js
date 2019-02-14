import { Op } from 'sequelize';
import models from '../db/models';
import errorResponse from '../helpers/errorHelpers';
import Basehelper from '../helpers/baseHelper';

const { Ratings, Articles } = models;

/**
 * @description A collection of controller methods for rating an article
 * @class RatingsController
 */
class RatingsController extends Basehelper {
  /**
   * @description controller method for rating an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async rateArticle(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { articleId } = req.params;
      const { rating } = req.body;
      const article = await Articles.findOne({ where: { id: { [Op.eq]: articleId } } });
      RatingsController.checkIfDataExist(req, res, article, { message: 'Article not found' });
      if (article.userId === userId) errorResponse(res, 403, 'You cannot rate an article that you authored');
      const alreadyRated = await Ratings.findOne({ where: { userId, articleId } });

      if (alreadyRated) {
        const response = await Ratings.update(
          { rating },
          {
            where: { userId, articleId },
            returning: true
          }
        );
        return res
          .status(200)
          .json({ message: 'Article rating successfully updated', articleRating: response[1][0] });
      }
      const articleRating = await Ratings.create({ userId, articleId, rating });
      return res.status(201).json({ articleRating });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for getting a single article rating
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getOneArticleRating(req, res, next) {
    try {
      const { ratingId } = req.params;
      const articleRating = await Ratings.findOne({
        where: { id: { [Op.eq]: ratingId } }
      });
      RatingsController.checkIfDataExist(req, res, articleRating, {
        message: 'Article rating not found'
      });
      return res.status(200).json({ articleRating });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for getting all the ratings for an
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getAllArticleRatings(req, res, next) {
    try {
      const { articleId } = req.params;
      const articleRatings = await Ratings.findAll({ where: { articleId } });
      RatingsController.checkIfDataExist(req, res, articleRatings.length, {
        message: 'No ratings found for this article'
      });
      const numberOfRatings = articleRatings.length;
      const ratings = articleRatings.map(article => article.rating);
      const totalRatings = ratings.reduce((a, b) => a + b);
      const averageRating = totalRatings / numberOfRatings;
      return res.status(200).json({ numberOfRatings, averageRating, articleRatings });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for cancelling an article rating
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async cancelRating(req, res, next) {
    try {
      const { ratingId: id } = req.params;
      const { id: userId } = req.user;
      const rating = await Ratings.findOne({ where: { id, userId } });
      RatingsController.checkIfDataExist(req, res, rating, {
        message: 'Article rating not found'
      });
      await Ratings.destroy({ where: { id, userId } });
      return res.status(200).json({ message: 'Rating successfully cancelled' });
    } catch (error) {
      return next(error);
    }
  }
}

export default RatingsController;
