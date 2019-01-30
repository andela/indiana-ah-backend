import { expect } from 'chai';

// dummy function to add numbers
const addNumbers = (a, b) => a + b;

// test function addNumbers
describe('A function to add numbers', () => {
  it('should add two numbera', () => {
    const result = addNumbers(3, 4);
    expect(result).to.equal(7);
  });
});
