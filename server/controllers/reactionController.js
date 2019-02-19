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
        ).then(() => res.status(200).json({
          message: `You have successfully ${reactionType}d this article`
        }));
      }
      if (!created && reactionType === dbReactionType) {
        await Reactions.destroy({
          where: { articleId, userId }
        });
        return res.status(200).json({ message: 'Reaction successfully deleted' });
      }
    } catch (error) {
      return next(error);
    }
  }
}

export default ReactionController;
