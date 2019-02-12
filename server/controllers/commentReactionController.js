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
    const { commentId, reactionType } = req.body;
    const { id: userId } = req.user;

    try {
      const reaction = await CommentReactions.findOrCreate({
        where: { commentId, userId },
        defaults: {
          reactionType,
          commentId,
          userId
        }
      }).spread((
        {
          dataValues: {
            commentId: dbCommentId, userId: dbUserId, reactionType: dbReactionType
          }
        },
        created
      ) => ({
        dbCommentId, dbUserId, dbReactionType, created
      }));
      const { created, dbReactionType } = reaction;
      if (created) {
        return res.status(200).json({ message: `You have successfully ${reactionType}d this comment` });
      }
      if (!created && reactionType !== dbReactionType) {
        await CommentReactions.update(
          { reactionType },
          {
            where: { commentId, userId },
            returning: true
          }
        ).then(() => res.status(200).json({
          message: `You have successfully ${reactionType}d this comment`
        }));
      }
      if (!created && reactionType === dbReactionType) {
        await CommentReactions.destroy({
          where: { commentId, userId }
        });
        return res.status(200).json({ message: 'Reaction successfully deleted' });
      }
    } catch (error) {
      return errorMessage(res, 500, 'internal server error');
    }
  }
}

export default CommentReactionController;
