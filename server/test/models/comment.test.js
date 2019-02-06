import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import CommentModel from '../../db/models/comments';

describe('..db/models/users', () => {
  const Comment = CommentModel(sequelize, dataTypes);
  const comment = new Comment();
  checkModelName(Comment)('Comments');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId', 'commentBody']
      .forEach(checkPropertyExists(comment));
  });
  // test associations
  context('associations', () => {
    const Articles = 'Articles';
    const Users = 'Users';

    before(() => {
      Comment.associate({ Articles });
      Comment.associate({ Users });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Comment.belongsTo.calledWith(Articles)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Comment.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
