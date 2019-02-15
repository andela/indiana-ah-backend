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
  static async reaction(req, res, model, modelColumnObj) {
    const { reactionType } = req.body;
    const { id: userId } = req.user;
    let deleted = false;
    let id;
    const response = await model.findOne({
      where: { ...modelColumnObj, userId }
    });
    if (response) {
      const dbReaction = response.dataValues;
      const { reactionType: dbReactionType, id: reactionId } = dbReaction;
      id = reactionId;
      if (reactionType === dbReactionType) {
        deleted = true;
        BaseHelper.deleteReaction(req, res, model, modelColumnObj, userId);
      }
    }
    if (!deleted) {
      const updateOrCreate = await model.upsert({
        id,
        ...modelColumnObj,
        userId,
        reactionType
      });
      if (updateOrCreate) {
        return res.status(200).json({
          message: 'Reaction updated'
        });
      }
      return res.status(200).json({ message: 'Reaction created' });
    }
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
