import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import CommentReactionModel from '../../db/models/commentReactions';

describe('..db/models/commentreactions', () => {
  const CommentReaction = CommentReactionModel(sequelize, dataTypes);
  const commentReaction = new CommentReaction();
  checkModelName(CommentReaction)('CommentReactions');
  // check for attributes
  context('properties', () => {
    ['id', 'reactionType', 'userId', 'commentId']
      .forEach(checkPropertyExists(commentReaction));
  });
  // test associations
  context('associations', () => {
    const Comments = 'Comments';
    const Users = 'Users';

    before(() => {
      CommentReaction.associate({ Comments });
      CommentReaction.associate({ Users });
    });

    it('should define a belongsTo association with Article', () => {
      expect(CommentReaction.belongsTo.calledWith(Comments)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(CommentReaction.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
