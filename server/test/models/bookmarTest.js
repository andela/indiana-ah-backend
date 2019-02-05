import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import BookmarkModel from '../../db/models/bookmarks';

describe('..db/models/users', () => {
  const Bookmark = BookmarkModel(sequelize, dataTypes);
  const bookmark = new Bookmark();
  checkModelName(Bookmark)('Bookmark');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId']
      .forEach(checkPropertyExists(bookmark));
  });
  // test associations
  context('associations', () => {
    const Article = 'Article';
    const User = 'User';

    before(() => {
      Bookmark.associate({ Article });
      Bookmark.associate({ User });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Bookmark.belongsTo.calledWith(Article)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Bookmark.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
