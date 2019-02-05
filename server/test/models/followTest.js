import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import FollowModel from '../../db/models/follows';

describe('..db/models/users', () => {
  const Follow = FollowModel(sequelize, dataTypes);
  const follow = new Follow();
  checkModelName(Follow)('Follow');
  // check for attributes
  context('properties', () => {
    ['id', 'authorId', 'followerId']
      .forEach(checkPropertyExists(follow));
  });
  // test associations
  context('associations', () => {
    const User = 'User';

    before(() => {
      Follow.associate({ User });
    });

    it('should define a hasMany association with User', () => {
      expect(Follow.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
