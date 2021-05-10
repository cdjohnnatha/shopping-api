const logger = require('../../infrastructure/config/logs/logger');
const { httpCodes } = require('../../utils/consts/request-consts')

const defaultErrorHandler = (err, req, res, next) => {
  let defaultErrorMessage = 'Request unavailable';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  if (err.message.includes('invalid csrf token')) {
    defaultErrorMessage = 'invalid_csrf';
    err.extensions = { code: httpCodes.BAD_REQUEST };
    logger.customError({
      error: err,
      meta: {
        originalUrl: req.originalUrl,
        method: req.method,
        ip: req.ip,
        function: 'defaultErrorHandler',
      },
    });
  } else {
    logger.customError({
      error: err,
      meta: {
        originalUrl: req.originalUrl,
        method: req.method,
        ip: req.ip,
        function: 'defaultErrorHandler',
      },
    });
  }
  // render the error page
  res.status(err.status || 500).send(defaultErrorMessage);
};

module.exports = {
  defaultErrorHandler,
}