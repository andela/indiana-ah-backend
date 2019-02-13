import { Op } from 'sequelize';
import models from '../db/models';
import errorResponse from '../helpers/errorHelpers';

const { Ratings, Articles } = models;

/**
 * @description A collection of controller methods for rating an article
 * @class RatingController
 */
class RatingController {
  static async rateArticle(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { articleId } = req.params;
      const { rating } = req.body;
      const article = await Articles.findOne({ where: { id: { [Op.eq]: articleId } } });
      if (!article) return res.status(404).json({ message: 'Article not found' });
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

  static async getOneArticleRating(req, res, next) {
    try {
      const { ratingId } = req.params;
      const articleRating = await Ratings.findOne({
        where: { id: { [Op.eq]: ratingId } }
      });
      if (!articleRating) return res.status(404).json({ message: 'Article rating not found' });
      return res.status(200).json({ articleRating });
    } catch (error) {
      return next(error);
    }
  }

  static async getAllArticleRatings(req, res, next) {
    try {
      const { articleId } = req.params;
      const articleRatings = await Ratings.findAll({ where: { articleId } });
      if (!articleRatings.length) return res.status(404).json({ message: 'No ratings found for article' });
      const totalRatings = articleRatings.length;
      return res.status(200).json({ totalRatings, articleRatings });
    } catch (error) {
      return next(error);
    }
  }
}

export default RatingController;
