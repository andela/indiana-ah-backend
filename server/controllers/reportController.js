import models from '../db/models';
import commentReportLogic from '../helpers/commentReportHelper';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';

const { Reports, Articles, Users } = models;
/**
 * @description  Handles Users reports on articles
 * @class ReportController
 */
class ReportController extends BaseHelper {
  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async reportArticle(req, res, next) {
    const message = 'Article reported successfully';
    commentReportLogic(req, res, next, Articles, Reports, message);
  }

  /**
   *@description controller method for getting all reports
   * @param {object} req Request object
   * @param {object} res Response object
    * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getOneArticleReports(req, res, next) {
    try {
      const { slug } = req.params;
      const report = await Reports.findAll({
        where: { slug },
        returning: true,
        include: [
          {
            model: Users,
            attributes: ['username'],
            include: [
              { model: Articles, attributes: ['articleTitle', 'articleBody'], where: { slug } }
            ]
          }
        ]
      });
      if (!report) return errorMessage(res, 404, 'No reports found');
      return res.status(200).json({ message: 'Reports retrieve successful', report });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *@description controller method for getting all reports
   * @param {object} req Request object
   * @param {object} res Response object
    * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async getAllReports(req, res, next) {
    try {
      const report = await Reports.findAll({});
      if (!report) return errorMessage(res, 404, 'No reports found');
      return res.status(200).json({ message: 'Reports retrieve successful', report });
    } catch (error) {
      return next(error);
    }
  }
}

export default ReportController;
