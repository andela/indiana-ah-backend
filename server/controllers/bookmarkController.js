/**
 * @description A collection of controller methods for bookmarked articles
 * @class ArticleController
 */
class BookmarkController extends BaseHelper {
  /**
   * @description controller method for creating an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {Function} next passes control to the next middleware
   * @returns {Object} a response object
   */
  static async bookmarkArticle(req, res, next) {
    try {
      const { id: userId } = req.user;
      req.body.userId = userId;
      const userArticle = req.body.articleBody;
      const timeToRead = ArticleController.calculateTimeToRead(userArticle);
      const article = await Articles.create(req.body);
      return res.status(201).json({ article, timeToRead });
    } catch (error) {
      return next(error);
    }
  }
}

export default BookmarkController;
