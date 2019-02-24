import bcrypt from 'bcrypt';
import models from '../db/models';
import paginator from './paginator';

const { Articles, Users } = models;

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
   * @param { object } data
   * @returns {boolean} returns a boolean
   */
  static checkIfDataExist(data) {
    return !!data;
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
   * @returns {object} a response object
   */
  static async reaction(req, res, model, modelColumnObj) {
    let { reactionType } = req.body;
    reactionType = reactionType.toLowerCase();
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
          message: 'Reaction created'
        });
      }
      return res.status(200).json({ message: 'Reaction updated' });
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

  /**
   * @description helper method for searching articles
   * @static
   * @param {Object} req response object
   * @param {Object} res response object
   * @param {Object} condition query condition
   * @returns {Object} response object
   *
   * @memberOf BaseHelper
   */
  static async search(res, condition) {
    const articles = await Articles.findAll({
      include: [
        {
          model: Users,
          as: 'author',
          attributes: ['name', 'username', 'bio', 'imageUrl']
        }
      ],
      where: condition
    });
    return res.status(200).json({ searchResults: articles });
  }

  /**
   * @description helper method for extracting the number of reactions from any data
   * @static
   * @param {Object} data object with reactions
   * @param {Object} reactionObj reaction object
   * @returns {Number} number of likes and dislikes
   * @memberOf BaseHelper
   */
  static getOneReactionsCount(data, reactionObj) {
    const reactions = data[reactionObj].map(reaction => reaction.reactionType);
    const likes = reactions.filter(reaction => reaction === 'like').length;
    const dislikes = reactions.filter(reaction => reaction === 'dislike').length;
    data.likes = likes;
    data.dislikes = dislikes;
    delete data[reactionObj];
  }

  /**
   * @description helper method for extracting the number of reactions from a data collection
   * @static
   * @param {Array} dataCollection array of objects with reactions
   * @param {Object} reactionObj reaction object
   * @returns {Number} number of likes and dislikes
   * @memberOf BaseHelper
   */
  static extractAllReactionsCount(dataCollection, reactionObj) {
    return dataCollection.map((item) => {
      const data = item.toJSON();
      this.getOneReactionsCount(data, reactionObj);
      return data;
    });
  }
}

export default BaseHelper;
