import response from '../helpers/errorHelpers';
import getUsersStats from '../helpers/getUsersStats';

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
      const formatStat = await getUsersStats(userId);
      response(res, 200, { statistics: formatStat });
    } catch (error) {
      return next(error);
    }
  }
}

export default ReadingStatistics;
