import readingStatRepository from '../db/repositories/readingStats';
import response from '../helpers/errorHelpers';

const readingStatRepo = new readingStatRepository();

/**
 *
 *
 * @class ReadingStatistics
 */
class ReadingStatistics {
  /**
   *
   *
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} the reading statisitcs of the user
   * @memberOf ReadingStatistics
   */
  static async getReadingStatistics(req, res, next) {
    try {
      const { id: userId } = req.user;
      const count = await readingStatRepo.findAndCountStats(userId);
      if (!count) {
        response(res, 200, `you have read ${count} articles`);
      }
      response(res, 200, `you have read ${count} articles`);
    } catch (error) {
      return next(error);
    }
  }
}
export default ReadingStatistics;
