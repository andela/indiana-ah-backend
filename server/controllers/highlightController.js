import models from '../db/models';
import errorMessage from '../helpers/errorHelpers';

const { Articles, Highlights } = models;

/**
 * @description Handles Users highlights on Articles
 * @class HighlightController
 */
class HighlightController {
  /**
   * @description articleTextHighlight - controller method for highlighting text
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
      if (!article) {
        return errorMessage(res, 404, 'Article not found');
      }

      const { highlight } = req.body;
      // check if the highlighted text exist  in the article
      const findHighlight = article.dataValues.articleBody.includes(highlight);
      if (!findHighlight) {
        return errorMessage(res, 404, 'Article Highlighted text doesn\'t exist');
      }
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
   * @description deleteHighlight - controller method for deleting an highlighted text
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
      if (!article) {
        return errorMessage(res, 404, 'Article not found');
      }
      const { userId } = article.dataValues;
      const articleId = article.dataValues.id;
      const textHighlight = await Highlights.findOne({
        where: { articleId, userId },
        returning: true
      });
      if (!textHighlight) {
        return errorMessage(res, 404, 'No highlight on this Article');
      }
      await Highlights.destroy({ where: { id: textHighlight.dataValues.id }, returning: true });
      return res.status(200).json({
        message: 'Highlight removed successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description editHighlight - controller method for editing an highlighted text
   *
   * @param {object} req  Request object
   * @param {object} res  Response onject
   * @param {function} next Function to pass control to the next item
   * @returns {object} a response object
   */
  static async editHighlight(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      if (!article) {
        return errorMessage(res, 404, 'Article not found');
      }
      const { userId } = article.dataValues;
      const articleId = article.dataValues.id;
      const textHighlight = await Highlights.findOne({
        where: { articleId, userId },
        returning: true
      });
      if (!textHighlight) {
        return errorMessage(res, 404, 'No highlight on this Article');
      }
      const { highlight } = req.body;
      // check if the highlighted text exist  in the article
      const findHighlight = article.dataValues.articleBody.includes(highlight);
      if (!findHighlight) {
        return errorMessage(res, 404, 'Article Highlighted text doesn\'t exist');
      }
      const updatedHighlight = await Highlights.update(req.body, {
        returning: true,
        where: { id: textHighlight.dataValues.id }
      });
      return res.status(200).json({
        message: 'Highlight updated successfully',
        data: updatedHighlight[1][0]
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * *@description getHighlight - controller method for getting an highlighted text
   *
   * @param {object} req  Request object
   * @param {object} res  Response onject
   * @param {function} next Function to pass control to the next item
   * @returns {object} a response object
   */
  static async getHighlight(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Articles.findOne({
        where: { slug },
        returning: true
      });
      if (!article) {
        return errorMessage(res, 404, 'Article not found');
      }
      const { userId } = article.dataValues;
      const articleId = article.dataValues.id;
      const textHighlight = await Highlights.findAll({
        where: { articleId, userId },
        returning: true
      });
      if (!textHighlight.length) {
        return errorMessage(res, 404, 'No highlight on this Article');
      }
      return res.status(200).json({
        message: 'Highlight retrieved successfully',
        data: textHighlight
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default HighlightController;
