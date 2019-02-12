import models from '../db/models';
import commentReportLogic from '../helpers/commentReactionHelper';

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
   * @param {object} next Response object
   * @returns {Object} a response object
   */
  static async articleComment(req, res, next) {
    const message = 'Comment has been posted successfully';
    commentReportLogic(req, res, next, Articles, Comments, message);
  }

  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} next Response object
   * @returns {Object} a response object
   */
  static async getArticleComment(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      if (!article) {
        return res.status(404).json({
          message: 'Article not found'
        });
      }
      req.body.articleId = article.dataValues.id;
      const articleComments = await Comments.findAll({
        where: { slug },
        returning: true
      });
      return res.status(201).json({
        message: 'Comment has been posted successfully',
        data: articleComments
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CommentController;
