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
    req.body.userId = req.user.id;
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
