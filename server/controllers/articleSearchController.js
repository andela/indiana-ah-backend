import { Op } from 'sequelize';
import models from '../db/models';

const { Articles, Users } = models;

class ArticleSearchController {
  static async searchArticles(req, res, next) {
    try {
      const { findBy, value } = req.query;

      const filterParams = ['author', 'keyword', 'title', 'tag'];
      if (!filterParams.includes(findBy)) return res.status('400').json({ message: 'Invalid search parameter' });
      const articles = await Articles.findAll({
        where: {
          articleTitle: { [Op.iLike]: `%${value}%` }
        }
      });
      if (!articles.length) return res.status(404).json({ message: 'Couldn\'t find articles matching your search' });
      return res.status(200).json({ searchResults: articles });
    } catch (error) {
      return next(error);
    }
  }
}

export default ArticleSearchController;
