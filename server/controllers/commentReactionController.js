import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';

const { CommentReactions } = models;
/**
 *
 *
 * @class ReactionController
 */
class CommentReactionController extends BaseHelper {
  /**
   * @description commentReaction- controller method for liking and disliking a comment
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} next Response object
   * @returns {object} a response object
   */
  static async commentReaction(req, res, next) {
    const { commentId } = req.body;
    try {
      CommentReactionController.reaction(req, res, CommentReactions, { commentId }, 'commentId');
    } catch (error) {
      return next(error);
    }
  }
}

export default CommentReactionController;
