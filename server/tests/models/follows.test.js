import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import FollowModel from '../../db/models/follows';

describe('..db/models/follows', () => {
  const Follow = FollowModel(sequelize, dataTypes);
  const follow = new Follow();
  checkModelName(Follow)('Follows');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'followerId']
      .forEach(checkPropertyExists(follow));
  });
  // test associations
  context('associations', () => {
    const Users = 'Users';

    before(() => {
      Follow.associate({ Users });
    });

    it('should define a hasMany association with User', () => {
      expect(Follow.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
