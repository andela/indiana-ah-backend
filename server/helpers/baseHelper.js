import bcrypt from 'bcrypt';
/**
 * @class BaseHelper
 */
class BaseHelper {
  /**
   *
   * @param { string } location
   * @param {string} url
   * @param {string} token
   * @returns {string} link
   */
  static generateEmailLink(location, url, token) {
    const link = `${location}${url}?query=${token}`;
    return link;
  }

  /**
   *
   * @param { string } req
   * @param {string} res
   * @param { string } data
   * @param { string } message
   * @returns {boolean} returns a boolean
   */
  static checkIfDataExist(req, res, data, message) {
    if (!data) {
      return res.status(404).json(message);
    }
    return true;
  }

  /**
   * @description helper method for calculating time to read an article
   * @static
   * @param {string} article article to be read
   * @returns {Object} a response object
   */
  static calculateTimeToRead(article) {
    if (article) {
      const numberOfWords = article.split(' ').length;
      // average word per minute for reading
      const wpm = 150;
      const time = Math.round(numberOfWords / wpm);
      const timeToRead = time < 1 ? 'a couple of secs' : `${time} min read`;
      return timeToRead;
    }
    return false;
  }

  /**
   *
   * @static
   * @param {string} password
   * @returns {string} hashed password
   *
   * @memberOf BaseHelper
   */
  static hashPassword(password) {
    const saltRounds = 10;
    try {
      const response = bcrypt.hashSync(password, saltRounds);
      return response;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * @description articleReaction- controller method for liking and disliking an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} modelName Request object
   * @param {object} modelId Request object
   * @returns {object} a response object
   */
  static async reaction(req, res, modelName, modelId) {
    const { reactionType } = req.body;
    const { id: userId } = req.user;
    req.body.userId = userId;

    const reaction = await modelName.findOrCreate({
      where: { modelId, userId },
      defaults: {
        reactionType,
        modelId,
        userId
      }
    }).spread((
      {
        dataValues: {
          modelId: dbModelId, userId: dbUserId, reactionType: dbReactionType
        }
      },
      created
    ) => ({
      dbModelId, dbUserId, dbReactionType, created
    }));
    const { created, dbReactionType } = reaction;
    if (created) {
      return res.status(200).json({ message: `You have successfully ${reactionType}d this article` });
    }
    if (!created && reactionType !== dbReactionType) {
      await modelName.update(
        { reactionType },
        {
          where: { modelId, userId },
          returning: true
        }
      ).then(() => res.status(200).json({
        message: `You have sucessfully ${reactionType}d this article`
      }));
    }
    if (!created && reactionType === dbReactionType) {
      await modelName.destroy({
        where: { modelId, userId }
      });
      return res.status(200).json({ message: 'Reaction successfully deleted' });
    }
  }
}

export default BaseHelper;
