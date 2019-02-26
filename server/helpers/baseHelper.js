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
   * @param { string } passwordInput
   * @param { string } dbPassword
   * @return {boolean} returns a boolean
   */
  static validatePassword(passwordInput, dbPassword) {
    return bcrypt.compare(passwordInput, dbPassword);
  }

  /**
   *
   * @param {string} res
   * @param { string } data
   * @param { string } message
   * @returns {boolean} returns a boolean
   */
  static checkIfDataExist(res, data, message) {
    if (!data) {
      return res.status(404).json(message);
    }
  }

  /**
   *
   * @param { string } data
   * @returns {boolean} returns a boolean
   */
  static async checkIfExists(data) {
    console.log(data);
    const user = await Users.findOne({
      where: { username: data },
    });

    if (user) {
      return user;
    }
    return false;
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
   * @description uploadPicture- controller method for uploading pictures
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} model Request object
   * @param {object} modelColumnObj Request object
   * @param {function} next Function to pass control to the next function
   * @returns {object} a response object
   */
  static async uploadPicture(req, res, model, modelColumnObj) {
    const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;
    try {
      const updatedModel = await model.update(
        {
          imageUrl: image.url
        },
        {
          where: { ...modelColumnObj },
          returning: true
        }
      );

      const updatedRows = updatedModel[0];
      const updatedValues = updatedModel[1][0];
      let url = '';
      if (updatedValues) {
        url = updatedValues.dataValues.imageUrl;
      }

      if (!updatedRows) return res.status(404).json({ message: `${model === 'Users' ? 'User' : 'Article'} not found` });
      return res.status(200).json({
        picture: url
      });
    } catch (error) {
      return error;
    }
  }

  /** @description helper method for searching articles
   * @static
   * @param {Object} req response object
   * @param {Object} res response object
   * @param {Object} condition query condition
   * @returns {Object} response object
   *
   * @memberOf BaseHelper
   */
  static async search(req, res, condition) {
    const includedModels = [
      {
        model: Users,
        as: 'author',
        attributes: ['name', 'username', 'bio', 'imageUrl']
      }
    ];
    const articles = await paginator(Articles, req, includedModels, condition);
    if (!articles.length) return res.status(404).json({ message: 'Couldn\'t find articles matching your search' });
    return res.status(200).json({ searchResults: articles });
  }
}

export default BaseHelper;
