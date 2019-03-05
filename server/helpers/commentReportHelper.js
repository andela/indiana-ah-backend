import NotificationServices from '../services/notificationServices';

const { notifyUsersWhoBookmarked } = NotificationServices;

const commentReportLogic = async (req, res, next, articles, data, message) => {
  try {
    const { slug } = req.params;
    const article = await articles.findOne({
      where: { slug },
      returning: true
    });
    if (!article) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }
    notifyUsersWhoBookmarked(req, res, article.dataValues.id, slug);
    req.body.userId = article.dataValues.userId;
    req.body.articleId = article.dataValues.id;
    const articleComments = await data.create(req.body);
    return res.status(201).json({
      message,
      data: articleComments
    });
  } catch (error) {
    return next(error);
  }
};

export default commentReportLogic;
