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

  /**
   *
   * @param {object} req  Request object
   * @param {object} res  Response onject
   * @param {function} next Function to pass control to the next item
   * @returns {object} a response object
   */
  static async deleteHighlight(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      HighlightController.checkIfDataExist(req, res, article, {
        message: 'Article not found'
      });
      const { articleId } = article.dataValues.id;
      const textHighlight = await Highlights.findOne({
        where: { articleId },
        returning: true
      });
      if (textHighlight.dataValues.userId === article.dataValues.userId);
      await Highlights.destroy({ where: textHighlight.dataValues.id });
      return res.status(200).json({
        message: 'Highlight removed successful'
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default HighlightController;
