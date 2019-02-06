import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import { expect } from 'chai';

import ReportModel from '../../db/models/reports';

describe('..db/models/reports', () => {
  const Report = ReportModel(sequelize, dataTypes);
  const report = new Report();
  checkModelName(Report)('Reports');
  // check for attributes
  context('properties', () => {
    ['id', 'userId', 'articleId', 'reportBody']
      .forEach(checkPropertyExists(report));
  });
  // test associations
  context('associations', () => {
    const Articles = 'Articles';
    const Users = 'Users';

    before(() => {
      Report.associate({ Articles });
      Report.associate({ Users });
    });

    it('should define a belongsTo association with Article', () => {
      expect(Report.belongsTo.calledWith(Articles)).to.equal(true);
    });

    it('should define a belongsTo association with User', () => {
      expect(Report.belongsTo.calledWith(Users)).to.equal(true);
    });
  });
});
