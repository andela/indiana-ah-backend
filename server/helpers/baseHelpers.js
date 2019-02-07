import bcrypt from 'bcrypt';
/**
 *
 *
 * @class baseHelpers
 */
class baseHelpers {
  /**
   *
   *
   * @static
   * @param {string} password - the user's password
   * @returns {string} password
   *
   * @memberOf baseHelpers - hashes the users password
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    try {
      const response = await bcrypt.hash(password, saltRounds);
      return response;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {any} password - the password inputed
   * @param {any} hashed - the hashed password from the database
   * @returns {boolean} boolean
   *
   * @memberOf baseHelpers - validates the user password against the hash
   */
  static async validatePassword(password, hashed) {
    try {
      const authenticPassword = await bcrypt.compare(password, hashed);
      return authenticPassword;
    } catch (error) {
      return error;
    }
  }
}
export default baseHelpers;
