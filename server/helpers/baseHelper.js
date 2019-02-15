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
   * @description reaction- controller method for adding and removing reactions
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} model Request object
   * @param {object} modelColumnObj Request object
   * @param {string} modelIdKeyName Request object
   * @returns {object} a response object
   */
  static async reaction(req, res, model, modelColumnObj, modelIdKeyName) {
    const { reactionType } = req.body;
    const { id: userId } = req.user;
    const reaction = await model.findOrCreate({
      where: { ...modelColumnObj, userId },
      defaults: {
        reactionType,
        userId,
        ...modelColumnObj
      }
    }).spread((
      {
        dataValues: {
          [modelIdKeyName]: dbModelId, userId: dbUserId, reactionType: dbReactionType
        }
      },
      created
    ) => ({
      dbModelId, dbUserId, dbReactionType, created
    }));
    const { created, dbReactionType } = reaction;
    if (created) {
      return res.status(200).json({ message: `You have successfully ${reactionType}d` });
    }
    if (!created && reactionType !== dbReactionType) {
      BaseHelper.updateReaction(req, res, model, modelColumnObj, userId, reactionType);
    }
    if (!created && reactionType === dbReactionType) {
      BaseHelper.deleteReaction(req, res, model, modelColumnObj, userId);
    }
  }

  /**
   * @description updateReaction- controller method for updating likes and dislikes
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} model Request object
   * @param {object} columnObj Request object
   * @param {uuid} userId User Id
   * @param {string} reactionType type of reaction
   * @returns {object} a response object
   */
  static async updateReaction(req, res, model, columnObj, userId, reactionType) {
    await model.update(
      { reactionType },
      {
        where: { ...columnObj, userId },
        returning: true
      }
    ); res.status(200).json({
      message: `You have successfully ${reactionType}d`
    });
  }

  /**
   * @description deleteReaction- controller method for deleting likes and dislikes
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} model Request object
   * @param {object} columnObj Request object
   * @param {uuid} userId User Id
   * @returns {object} a response object
   */
  static async deleteReaction(req, res, model, columnObj, userId) {
    await model.destroy({
      where: { ...columnObj, userId }
    });
    return res.status(200).json({ message: 'Reaction successfully deleted' });
  }
}

export default BaseHelper;
