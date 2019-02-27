import models from '../db/models';
import errorMessage from '../helpers/errorHelpers';

const { Bookmarks, Articles } = models;

/**
 * @description A collection of controller methods for handling bookmarked articles
 * @class ArticleController
 */
class BookmarkController {
  /**
   * @description controller method for bookmarking an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async createOrRemoveBookmark(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { articleId } = req.params;

      const foundArticle = await Articles.findByPk(articleId);
      if (!foundArticle) errorMessage(res, 404, 'Article not found');

      const [bookmark, created] = await Bookmarks.findOrCreate({
        where: { articleId },
        defaults: { userId }
      });
      if (created) {
        return res.status(200).json({
          message: 'Article bookmarked successfully',
          bookmark
        });
      }
      await bookmark.destroy({ force: true });
      return res.status(200).json({ message: 'Bookmark removed successfully' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @static
   * @description Method to fetch a user's bookmarked article
   * @param {object} req HTTP request object
   * @param {object} res HTTP response object
   * @param {Function} next passes control to the next middleware
   * @returns {object} a response object
   */
  static async getUserBookmarkedArticles(req, res, next) {
    try {
      const { id: userId } = req.user;
      const userBookmarks = await Bookmarks.findAll({
        where: { userId }
      });
      if (userBookmarks.length === 0) return res.status(200).json({ message: 'You do not have any bookmarked article' });
      return res.status(200).json({
        message: 'Bookmarked articles successfully found',
        userBookmarks,
        bookmarkCount: userBookmarks.length
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default BookmarkController;
