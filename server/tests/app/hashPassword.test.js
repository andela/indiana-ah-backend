import { expect } from 'chai';
import baseHelpers from '../../helpers/baseHelper';

describe('bcrypt hash', () => {
  it('it should hash the password', () => {
    expect(baseHelpers.hashPassword('dozie')).to.have.length(60);
  });
});
