import models from '../db/models';

const { Reports, Articles } = models;

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
    try {
      req.body.userId = req.user.id;
      const { slug } = req.params;
      const article = await Articles.findOne({ where: { slug }, returning: true });
      if (!article) {
        return res.status(404).json({
          message: 'Article not found'
        });
      }
      req.body.articleId = article.dataValues.id;
      const reportArticle = await Reports.create(req.body);
      return res.status(201).json({
        message: 'Comment has been posted successfully',
        data: reportArticle
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ReportController;
