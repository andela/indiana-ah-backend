import models from '../db/models';
import BaseHelper from '../helpers/baseHelper';
import errorMessage from '../helpers/errorHelpers';

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
      const textHighlight = await Highlights.findOne({
        where: { articleId: article.dataValues.id },
        returning: true
      });
      if (!textHighlight) {
        return errorMessage(res, 404, 'No highlight on this Article');
      }
      if (textHighlight.dataValues.userId === article.dataValues.userId);
      await Highlights.destroy({ where: { id: textHighlight.dataValues.id }, returning: true });
      return res.status(200).json({
        message: 'Highlight removed successful'
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
      const articleId = article.dataValues.id;
      const textHighlight = await Highlights.findOne({
        where: { articleId },
        returning: true
      });

      const { highlight } = req.body;
      // check if the highlighted text exist  in the article
      const findHighlight = textHighlight.dataValues.includes(highlight);
      if (!findHighlight) {
        return errorMessage(res, 404, 'Article Highlighted text doesn\'t exist');
      }

      // check if the UserID that created the hignlight is same as the one that highlighted the text
      if (textHighlight.dataValues.userId !== article.dataValues.userId) {
        return res.status(401).json({
          message: 'You are not Authorized'
        });
      }
      const updatedHighlight = await Highlights.update(req.body, {
        returning: true,
        where: { id: textHighlight.dataValues.id }
      });
      return res.status(200).json({
        message: 'Highlight updated successfully',
        data: updatedHighlight
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default HighlightController;
