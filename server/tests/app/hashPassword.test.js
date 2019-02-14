import { expect } from 'chai';
import baseHelpers from '../../helpers/baseHelper';

describe('bcrypt hash', () => {
  it('it should hash the password', () => {
    expect(baseHelpers.hashPassword('dozie')).to.have.length(60);
    expect(baseHelpers.hashPassword()).to.equal(undefined);
  });
  it('it should throw an error if there is no parameter in the calculate time to read function', () => {
    expect(baseHelpers.calculateTimeToRead()).to.equal(false);
  });
});
