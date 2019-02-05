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
  checkModelName(Comment)('Comment');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId']
      .forEach(checkPropertyExists(comment));
  });
  // test associations
  context('associations', () => {
    const Article = 'Article';
    const User = 'User';

    before(() => {
      Comment.associate({ Article });
      Comment.associate({ User });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Comment.belongsTo.calledWith(Article)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Comment.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
