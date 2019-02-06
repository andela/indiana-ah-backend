import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ReportModel from '../../db/models/reports';

describe('..db/models/users', () => {
  const Report = ReportModel(sequelize, dataTypes);
  const report = new Report();
  checkModelName(Report)('Report');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId', 'reportBody']
      .forEach(checkPropertyExists(report));
  });
  // test associations
  context('associations', () => {
    const Article = 'Article';
    const User = 'User';

    before(() => {
      Report.associate({ Article });
      Report.associate({ User });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Report.belongsTo.calledWith(Article)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Report.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
