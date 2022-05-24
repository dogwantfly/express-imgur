const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true; // 可預期錯誤
  next(error);
}

module.exports = appError;