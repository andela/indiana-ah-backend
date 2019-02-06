import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import BookmarkModel from '../db/models/bookmarks';

describe('..db/models/follows', () => {
  const Bookmark = BookmarkModel(sequelize, dataTypes);
  const bookmark = new Bookmark();
  checkModelName(Bookmark)('Bookmarks');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId']
      .forEach(checkPropertyExists(bookmark));
  });
  // test associations
  context('associations', () => {
    const Articles = 'Articles';
    const Users = 'Users';

    before(() => {
      Bookmark.associate({ Articles });
      Bookmark.associate({ Users });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Bookmark.belongsTo.calledWith(Articles)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Bookmark.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
