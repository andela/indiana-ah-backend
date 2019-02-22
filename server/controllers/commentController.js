import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';
import ArticleController from './articleController';

const {
  Comments, Articles, CommentEditHistories, CommentReactions
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
  static async articleComment(req, res, next) {
    const message = 'Comment posted successfully';
    commentReportLogic(req, res, next, Articles, Comments, message);
  }

  /**
   * @description controller method for getting all articles
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
        include: [{ model: CommentReactions }, { model: CommentEditHistories }]
      });
      articleComments = ArticleController.getAllReactionsCount(articleComments, 'CommentReactions');
      return res.status(200).json({
        message: 'Comment retrieved successfully',
        comments: articleComments
      });
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
      const { commentBody: update } = req.body;
      const comment = await Comments.findOne({ where: { id: commentId, userId } });
      if (!comment) return errorMessage(res, 404, 'Comment not found');
      const { updatedAt, commentBody } = comment;
      await CommentEditHistories.create({
        commentBody,
        commentId,
        createdAt: updatedAt
      });
      const updatedComment = await Comments.update(
        { commentBody: update },
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
