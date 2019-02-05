const errorMessage = (res, errCode, errMsg) => res.status(errCode).json({
  message: errMsg,
  statusCode: errCode
});

export default errorMessage;
