const logger = require('./logger/logger')

/**
 * @param {object} error - Error object.
 * @param {*} port - port of service.
 */
const onError = (error) => {
  logger.customError({
    error,
    meta: {
      error_type: 'CONFIG_ERROR',
      error_group: 'SYSTEM_ERROR',
      function: 'onError',
    },
  });
  const port = process.env.PORT || 3000;

  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.customError({
        error,
        meta: { additional_message: `${bind} requires elevated privileges` },
      });
      process.exit(1);
    case 'EADDRINUSE':
      logger.customError({
        error,
        meta: { additional_message: `${bind} is already in use` },
      });
      process.exit(1);
    default:
      throw error;
  }
};

const uncaughtExceptionMonitorHandler = (err, origin) => {
  logger.error({
    error: err,
    meta: {
      function: 'uncaughtExceptionMonitorHandler',
      additional_message: 'Not handled error',
      origin,
    },
  });
};

const unhandledRejectionHandler = (reason, promise) => {
  logger.error({
    error: reason,
    meta: {
      function: 'unhandledRejectionHandler',
      promise,
    },
  });
};

const warningExceptionHandler = (reason) => {
  const { name = '', stack = '', message = '' } = reason;
  logger.warning({
    message,
    attributes: {
      meta: {
        function: 'warningExceptionHandler',
        additional_message: 'Maybe caused by libraries',
        stack,
        name,
      },
    },
  });
};

module.exports = {
  onError,
  uncaughtExceptionMonitorHandler,
  unhandledRejectionHandler,
  warningExceptionHandler,
};