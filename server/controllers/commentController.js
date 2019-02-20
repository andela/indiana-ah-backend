import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';
import BaseHelper from '../helpers/baseHelper';

const { Comments, Articles, CommentEditHistories } = models;

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
   * @description controller method for fetching all comments of an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getArticleComments(req, res, next) {
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
   * @description controller method for deleting a comment
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {function} next function to pass control to the next item
   * @returns {object} a response object
   */
  static async deleteComment(req, res, next) {
    const { commentId: id } = req.body;
    const { id: userId } = req.user;
    try {
      const comment = await Comments.findByPk(id);
      if (!comment) return errorMessage(res, 404, 'Comment not found');

      const { userId: dbUserId } = comment.dataValues;
      if (userId === dbUserId) {
        const deletedComment = await comment.destroy();
        return res.status(200).json({
          message: 'Comment deleted successfully',
          comments: deletedComment
        });
      }
      return res.status(403).json({ message: 'You can only delete your own comment' });
    } catch (error) {
      return next(error);
    }
  
  static async updateComment(req, res, next) {
    try {
      const { userId } = req.query;
      const { commentId } = req.params;
      const comment = await Comments.findOne({ where: { commentId } });
      CommentController.checkIfDataExist(req, res, comment, 'Comment not found');
      const { createdAt, commentBody } = comment;
      await CommentEditHistories.create({ commentBody, commentId, createdAt });
      const updatedComment = await Comments.update({
        where: { userId, commentId },
        returning: true
      });
      return res
        .status(200)
        .json({ message: 'Comment successfully updated', comment: updatedComment });
    } catch (error) {
      next(error);
    }
  }

  // static async getOneComment(req, res, next) {
  //   const
  // }
}

export default CommentController;
