import models from '../db/models';
import errorMessage from '../helpers/errorHelpers';
import BaseHelper from '../helpers/baseHelper';

const { Reactions, Articles } = models;
/**
 *
 *
 * @class ReactionController
 */
class ReactionController extends BaseHelper {
  /**
   * @description articleReaction- controller method for liking and disliking an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {function} next Function to pass control to the next item
   * @returns {object} a response object
   */
  static async articleReaction(req, res, next) {
    const { slug } = req.params;
    const { reactionType } = req.body;
    const allowedReactionTypes = ['like', 'dislike'];
    const article = await Articles.findOne({
      where: { slug },
    });
    if (!article) {
      return errorMessage(res, 404, 'Article not found');
    }
    const articleId = article.id;
    try {
      if (allowedReactionTypes.includes(reactionType.toLowerCase())) {
        ReactionController.reaction(req, res, Reactions, { articleId });
      } else {
        return errorMessage(res, 400, 'This is not an allowed reaction type');
      }
    } catch (error) {
      return next(error);
    }
  }
}

export default ReactionController;
