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
   *
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
      return error;
    }
  }
}

export default BaseHelper;
