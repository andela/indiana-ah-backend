import { expect } from 'chai';
import paginator from '../../helpers/paginator';
import models from '../../db/models/index';

const { Articles } = models;

describe('paginator', () => {
  it('should return paginated article', async () => {
    const result = await paginator(Articles, { query: { page: 1, limit: 9 } });
    expect(result).to.be.an('Array');
  });
});
