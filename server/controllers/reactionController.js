import models from '../db/models';
import errorMessage from '../helpers/errorHelpers';
import BaseHelper from '../helpers/baseHelper';

const { Reactions } = models;
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
   * @returns {object} a response object
   */
  static async articleReaction(req, res) {
    const { articleId, reactionType } = req.body;
    const { id: userId } = req.user;
    req.body.userId = userId;

    try {
      const reaction = await Reactions.findOrCreate({
        where: { articleId, userId },
        defaults: {
          reactionType,
          articleId,
          userId
        }
      }).spread((
        {
          dataValues: {
            articleId: dbArticleId, userId: dbUserId, reactionType: dbReactionType
          }
        },
        created
      ) => ({
        dbArticleId, dbUserId, dbReactionType, created
      }));
      const { created, dbReactionType } = reaction;
      if (created) {
        return res.status(200).json({ message: `You have successfully ${reactionType}d this article` });
      }
      if (!created && reactionType !== dbReactionType) {
        await Reactions.update(
          { reactionType },
          {
            where: { articleId, userId },
            returning: true
          }
        ).then(() => {
          return res.status(200).json({
            message: `You have successfully ${reactionType}d this article`
          });
        });
      }
      if (!created && reactionType === dbReactionType) {
        await Reactions.destroy({
          where: { articleId, userId }
        });
        return res.status(200).json({ message: 'Reaction successfully deleted' });
      }
    } catch (error) {
      return errorMessage(res, 500, 'Internal Server Error');
    }
  }
}

export default ReactionController;
