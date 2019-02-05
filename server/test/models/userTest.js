import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import UserModel from '../../db/models/users';

describe('..db/models/users', () => {
  const User = UserModel(sequelize, dataTypes);
  const user = new User();
  checkModelName(User)('User');
  // check for attributes
  context('properties', () => {
    ['id', 'username', 'name', 'email', 'imageUrl', 'password', 'bio', 'isVerified', 'subscribed']
      .forEach(checkPropertyExists(user));
  });
  // test associations
  context('associations', () => {
    const Article = 'Article';
    const Comment = 'Comment';
    const Follow = 'Follow';
    const Bookmark = 'Bookmark';
    const Reaction = 'Reaction';
    const Report = 'Report';

    before(() => {
      User.associate({ Article });
      User.associate({ Comment });
      User.associate({ Follow });
      User.associate({ Bookmark });
      User.associate({ Reaction });
      User.associate({ Report });
    });

    it('should define a hasMany association with Article', () => {
      expect(User.hasMany.calledWith(Article)).to.equal(true);
      // expect(Article.hasMany.calledWith(Bookmark)).to.equal(true);
      // expect(Article.hasMany.calledWith(Reaction)).to.equal(true);
      // expect(Article.hasMany.calledWith(Report)).to.equal(true);
      // expect(Article.hasMany.calledWith(Follow)).to.equal(false);
    });

    it('should define a hasMany association with Comment', () => {
      expect(User.hasMany.calledWith(Comment)).to.equal(true);
    });
    it('should define a hasMany association with Bookmark', () => {
      expect(User.hasMany.calledWith(Bookmark)).to.equal(true);
    });
    it('should define a hasMany association with Follow', () => {
      expect(User.hasMany.calledWith(Follow)).to.equal(true);
    });
    it('should define a hasMany association with Reaction', () => {
      expect(User.hasMany.calledWith(Reaction)).to.equal(true);
    });
    it('should define a hasMany association with Report', () => {
      expect(User.hasMany.calledWith(Report)).to.equal(true);
    });
  });
});
