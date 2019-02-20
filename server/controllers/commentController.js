import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import errorMessage from '../helpers/errorHelpers';

const { Comments, Articles } = models;

/**
 * @description  Handles Users comments on articles
 * @class CommentController
 */
class CommentController {
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
}

export default CommentController;
