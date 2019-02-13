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
   * @description commentReaction- controller method for liking and disliking an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} next Response object
   * @returns {object} a response object
   */
  static async commentReaction(req, res) {
    const { commentId } = req.body;
    try {
      CommentReactionController.reaction(req, res, CommentReactions, commentId);
    } catch (error) {
      return errorMessage(res, 500, 'internal server error');
    }
  }
}

export default CommentReactionController;
