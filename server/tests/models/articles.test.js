import {
  sequelize, dataTypes, checkModelName, checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ArticleModel from '../../db/models/articles';

describe('..db/models/articles', () => {
  const Article = ArticleModel(sequelize, dataTypes);
  const article = new Article();
  checkModelName(Article)('Articles');
  // check for attributes
  context('properties', () => {
    ['id', 'articleTitle', 'articleBody', 'slug', 'imageUrl', 'tags', 'userId']
      .forEach(checkPropertyExists(article));
  });
  // test associations
  context('associations', () => {
    const Users = 'Users';
    const Comments = 'Comments';
    const Follows = 'Follows';
    const Bookmarks = 'Bookmarks';
    const Reactions = 'Reactions';
    const Reports = 'Reports';

    before(() => {
      Article.associate({ Users });
      Article.associate({ Comments });
      Article.associate({ Follows });
      Article.associate({ Bookmarks });
      Article.associate({ Reactions });
      Article.associate({ Reports });
    });

    it('should define a belongsTo association with User', () => {
      expect(Article.belongsTo.calledWith(Users)).to.equal(true);
      expect(Article.hasMany.calledWith(Comments)).to.equal(true);
      expect(Article.hasMany.calledWith(Bookmarks)).to.equal(true);
      expect(Article.hasMany.calledWith(Reactions)).to.equal(true);
      expect(Article.hasMany.calledWith(Reports)).to.equal(true);
      expect(Article.hasMany.calledWith(Follows)).to.equal(false);
    });
  });
});
