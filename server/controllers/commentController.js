import models from '../db/models';
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
   * @returns {Object} a response object
   */
  static async commentAnArticle(req, res) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;
      req.body.userId = userId;
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
      const Articlecomments = await Comments.create(req.body);
      return res.status(201).json({
        message: 'Comment has been posted successfully',
        data: Articlecomments
      });
    } catch (error) {
      return errorMessage(res, 500, 'internal server error');
    }
  }
}

export default CommentController;
