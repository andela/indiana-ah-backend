export default (password) => {
  // eslint-disable-next-line no-console
  console.log('hahahahahahahahfdfdfdf');
  const regularExpression = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  const valid = regularExpression.test(password);
  // eslint-disable-next-line no-console
  console.log('hahahahahahahah:', valid);
  return valid;
};
