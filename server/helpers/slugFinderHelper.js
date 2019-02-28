export default (req, Articles) => {
  const { slug } = req.params;
  const article = Articles.findOne({
    where: { slug },
    returning: true
  });
  return article;
};
