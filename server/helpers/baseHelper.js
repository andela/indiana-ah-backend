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
      const timeToRead = (time < 1) ? 'a couple of secs' : `${time} min read`;
      return timeToRead;
    }
    return false;
  }
}

export default BaseHelper;
