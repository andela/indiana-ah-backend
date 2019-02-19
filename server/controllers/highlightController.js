import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';

const { Articles, Highlights } = models;

/**
 * @description Handles Users highlights on Articles
 * @class HighlightController
 */
class HighlightController extends BaseHelper {
  /**
   *
   * @param {object} req  Request object
   * @param {object} res  Response onject
   * @param {function} next Function to pass control to the next item
   * @returns {object} a response object
   */
  static async articleTextHighlight(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      HighlightController.checkIfDataExist(req, res, article, {
        message: 'Article not found'
      });
      req.body.userId = article.dataValues.userId;
      req.body.articleId = article.dataValues.id;
      const articleHighlight = await Highlights.create(req.body);
      return res.status(201).json({
        message: 'Highlight successful',
        data: articleHighlight
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default HighlightController;
