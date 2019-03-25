import { expect } from 'chai';
import baseHelpers from '../../helpers/baseHelper';

describe('bcrypt hash', () => {
  it('it should hash the password', () => {
    expect(baseHelpers.hashPassword('dozie')).to.have.length(60);
    expect(baseHelpers.hashPassword()).to.equal(undefined);
  });
});

describe('Calculate time to read an article', () => {
  it('should calculate the time it takes to read an article', () => {
    expect(baseHelpers.calculateTimeToRead('Heya')).to.equal('Less than a minute read');
  });
  it('it should throw an error if there is no parameter in the calculate time to read function', () => {
    expect(baseHelpers.calculateTimeToRead()).to.equal(false);
  });
});
