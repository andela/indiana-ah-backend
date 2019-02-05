import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ArticleModel from '../../db/models/articles';

describe('..db/models/article', () => {
  const Article = ArticleModel(sequelize, dataTypes);
  const article = new Article();
  checkModelName(Article)('Article');
  // check for attributes
  context('properties', () => {
    ['id', 'articleTitle', 'articleBody', 'articleSlug', 'imageUrl', 'tag', 'userId']
      .forEach(checkPropertyExists(article));
  });
  // test associations
  context('associations', () => {
    const User = 'User';
    const Comment = 'Comment';
    const Follow = 'Follow';
    const Bookmark = 'Bookmark';
    const Reaction = 'Reaction';
    const Report = 'Report';

    before(() => {
      Article.associate({ User });
      Article.associate({ Comment });
      Article.associate({ Follow });
      Article.associate({ Bookmark });
      Article.associate({ Reaction });
      Article.associate({ Report });
    });

    it('should define a belongsTo association with User', () => {
      expect(Article.belongsTo.calledWith(User)).to.equal(true);
      expect(Article.hasMany.calledWith(Comment)).to.equal(true);
      expect(Article.hasMany.calledWith(Bookmark)).to.equal(true);
      expect(Article.hasMany.calledWith(Reaction)).to.equal(true);
      expect(Article.hasMany.calledWith(Report)).to.equal(true);
      expect(Article.hasMany.calledWith(Follow)).to.equal(false);
    });
  });
});
