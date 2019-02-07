/**
 * @class BaseHelper
 */
class BaseHelper {
/**
 *
 * @param { string } url
 * @param {string} token
 * @returns {string} link
 */
  static generateEmailLink(url, token) {
    const link = `${url}?query=${token}`;
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
}

export default BaseHelper;
