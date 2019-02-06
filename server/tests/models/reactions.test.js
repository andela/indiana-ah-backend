import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ReactionModel from '../../db/models/reactions';

describe('..db/models/reactions', () => {
  const Reaction = ReactionModel(sequelize, dataTypes);
  const reaction = new Reaction();
  checkModelName(Reaction)('Reactions');
  // check for attributes
  context('properties', () => {
    ['id', 'reactionType', 'userId', 'articleId']
      .forEach(checkPropertyExists(reaction));
  });
  // test associations
  context('associations', () => {
    const Articles = 'Articles';
    const Users = 'Users';

    before(() => {
      Reaction.associate({ Articles });
      Reaction.associate({ Users });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Reaction.belongsTo.calledWith(Articles)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Reaction.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
