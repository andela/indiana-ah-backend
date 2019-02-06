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
  checkModelName(User)('Users');
  // check for attributes
  context('properties', () => {
    ['id', 'username', 'name', 'email', 'imageUrl', 'password', 'bio', 'isVerified', 'subscribed']
      .forEach(checkPropertyExists(user));
  });
  // test associations
  context('associations', () => {
    const Articles = 'Articles';
    const Comments = 'Comments';
    const Follows = 'Follows';
    const Bookmarks = 'Bookmarks';
    const Reactions = 'Reactions';
    const Reports = 'Reports';

    before(() => {
      User.associate({ Articles });
      User.associate({ Comments });
      User.associate({ Follows });
      User.associate({ Bookmarks });
      User.associate({ Reactions });
      User.associate({ Reports });
    });

    it('should define a hasMany association with Article', () => {
      expect(User.hasMany.calledWith(Articles)).to.equal(true);
    });

    it('should define a hasMany association with Comment', () => {
      expect(User.hasMany.calledWith(Comments)).to.equal(true);
    });
    it('should define a hasMany association with Bookmark', () => {
      expect(User.hasMany.calledWith(Bookmarks)).to.equal(true);
    });
    it('should define a hasMany association with Follow', () => {
      expect(User.hasMany.calledWith(Follows)).to.equal(true);
    });
    it('should define a hasMany association with Reaction', () => {
      expect(User.hasMany.calledWith(Reactions)).to.equal(true);
    });
    it('should define a hasMany association with Report', () => {
      expect(User.hasMany.calledWith(Reports)).to.equal(true);
    });
  });
});
