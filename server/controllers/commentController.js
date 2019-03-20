import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';

const {
  Comments, Articles, CommentEditHistories, CommentReactions, Users
} = models;

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
  static async createComment(req, res, next) {
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
  static async getAllArticleComments(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug }
      });
      if (!article) return errorMessage(res, 404, 'Article not found');
      let articleComments = await Comments.findAll({
        where: { articleId: article.id },
        include: [
          { model: CommentReactions },
          { model: Users, as: 'commenter', attributes: ['name', 'username', 'imageUrl', 'id'] }
        ]
      });

      articleComments = CommentController.extractAllReactionsCount(
        articleComments,
        'CommentReactions'
      ).map((comment) => {
        comment.edited = comment.updatedAt.toString() !== comment.createdAt.toString();
        return comment;
      });
      return res.status(200).json({
        message: 'Comments retrieved successfully',
        comments: articleComments
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
  }

  /**
   * @description controller method for fetching the edit history of a comment
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getCommentEditHistory(req, res, next) {
    try {
      const { commentId } = req.params;
      const { id: userId } = req.user;
      const commentEditHistory = await CommentEditHistories.findAll({
        where: { commentId, userId }
      });
      return res.status(200).json({ commentEditHistory });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description controller method for updating a comment
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async updateComment(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { commentId } = req.params;
      const { commentBody: commentUpdate } = req.body;
      const comment = await Comments.findOne({ where: { id: commentId, userId } });
      if (!comment) return errorMessage(res, 404, 'Comment not found');
      const { updatedAt, commentBody } = comment;
      await CommentEditHistories.create({
        commentBody,
        userId,
        commentId,
        createdAt: updatedAt
      });
      const updatedComment = await Comments.update(
        { commentBody: commentUpdate },
        {
          where: { userId, id: commentId },
          returning: true
        }
      );
      return res
        .status(200)
        .json({ message: 'Comment successfully updated', comment: updatedComment[1][0] });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;
