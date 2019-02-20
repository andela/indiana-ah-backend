import models from '../db/models';
import commentReportLogic from '../helpers/commentReactionHelper';
import errorResponse from '../helpers/errorHelpers';

const { Reports, Articles, Users } = models;

/**
 * @description  Handles Users reports on articles
 * @class CommentController
 */
class ReportController {
  /**
   * @description controller method for commenting on an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} next Response object
   * @returns {Object} a response object
   */
  static async reportArticle(req, res, next) {
    const message = 'Article report is successful';
    commentReportLogic(req, res, next, Articles, Reports, message);
  }

  /**
   *@description controller method for getting all reports
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {object} next Response Object
   * @returns {Object} a response object
   */
  static async getAllReports(req, res, next) {
    try {
      const report = await Reports.findAll({
        include: [
          {
            model: Users,
            attributes: ['username', 'bio'],

            include: [{ model: Articles, attributes: ['articleTitle', 'articleBody'] }]
          }
        ]
      });
      if (!report.length) return errorResponse(res, 404, 'No reports found');
      return res.status(200).json({ message: 'Report retrieve successful', report });
    } catch (error) {
      return next(error);
    }
  }
}

export default ReportController;
