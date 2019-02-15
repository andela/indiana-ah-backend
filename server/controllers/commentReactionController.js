import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';

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
    const { commentId, reactionType } = req.body;
    const allowedReactionTypes = ['like', 'dislike'];

    try {
      if (allowedReactionTypes.includes(reactionType.toLowerCase())) {
        CommentReactionController.reaction(req, res, CommentReactions, { commentId });
      } else {
        return errorMessage(res, 400, 'This is not an allowed reaction type');
      }
    } catch (error) {
      return next(error);
    }
  }
}

export default CommentReactionController;
