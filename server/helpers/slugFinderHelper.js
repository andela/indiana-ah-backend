import errorMessage from './errorHelpers';

export default async (req, res, Articles) => {
  const { slug } = req.params;
  const article = await Articles.findOne({
    where: { slug },
    returning: true
  });
  if (!article) {
    return errorMessage(res, 404, 'Article not found');
  }
  return article;
};
