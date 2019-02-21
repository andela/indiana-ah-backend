import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import errorMessage from '../helpers/errorHelpers';
import BaseHelper from '../helpers/baseHelper';

const { Comments, Articles, CommentReactions } = models;

/**
 * @description  Handles Users comments on articles
 * @class CommentController
 */
class CommentController extends BaseHelper {
  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async articleComment(req, res, next) {
    const message = 'Comment posted successfully';
    commentReportLogic(req, res, next, Articles, Comments, message);
  }

  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getArticleComment(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      if (!article) return errorMessage(res, 404, 'Article not found');
      const articleComments = await Comments.findAll({
        where: { id: article.dataValues.id },
        returning: true
      });
      return res.status(200).json({
        message: 'Comment retrieved successfully',
        data: articleComments
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {function} next function to pass control to the next item
   * @returns {object} a response object
   */
  static async getArticleComments(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      if (!article) return errorMessage(res, 404, 'Article not found');
      const { id: articleId } = article.dataValues;
      const articleComments = await Comments.findAll({
        where: { articleId },
        include: [{ model: CommentReactions }]
      });
      return res.status(200).json({
        message: 'Comments retrieved successfully',
        comments: articleComments
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CommentController;
