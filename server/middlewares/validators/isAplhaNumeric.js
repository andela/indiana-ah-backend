export default (password) => {
  const regularExpression = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  const valid = regularExpression.test(password);
  return valid;
};
