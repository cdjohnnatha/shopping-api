const { format, transports, createLogger, config } = require('winston');
const Bottleneck = require('bottleneck');

const { timestamp, combine, json, colorize, label, errors, prettyPrint } = format;

const isDevelopmentEnviroment = process.env.NODE_ENV === 'dev';
const { LOG_LEVEL } = process.env;

const consoleTransport = new transports.Console({
  format: combine(
    prettyPrint(),
    // label({ attributes: {} }),
    colorize({ all: true }),
    errors({ stack: true }),
    timestamp(),
  ),
});

const bottleneck = new Bottleneck.default({
  maxConcurrent: 1,
  minTime: LOG_LEVEL === 'debug' ? 5000 : 3000,
});

const logger = createLogger({
  level: LOG_LEVEL || 'debug',
  levels: config.syslog.levels,
  exitOnError: false,
  format: combine(json(), timestamp()),
  transports: consoleTransport,
  exceptionHandlers: consoleTransport,
  silent: process.env.LOGGER_ON_TESTS === 'false',
});

if (isDevelopmentEnviroment) {
  logger.add(
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  );
  logger.add(new transports.File({ filename: 'logs/combined.log' }));
}


/**
 * @function customErrorObject
 * @description Creates an error pattern.
 * @param {Object} param - New custom object.
 * @param {Object} param.error - Error object.
 * @param {Object} param.meta  - Any additional information.
 * @param {String} param.meta.function  - Function name.
 * @param {String} param.meta.errorMessage  - Message get from error.
 * @param {String} param.meta.additional_message  - Any additional message.
 * @param {Boolean} [param.stringify=true]  - Logger object as JSON.stringify.
 * @returns {Object}
 */
 logger.customError = async ({ error = {}, meta = {} }) => {
  try {
    const { name = '', stack = '', message = '' } = error;
    let attributes = {
      name,
      stack,
      meta: {
        ...meta,
        service_name: 'shopping-api',
      },
    };

    if (process.env.NODE_ENV !== 'test') {
      bottleneck.schedule({}, () => Promise.resolve().then(() => {
          logger.error({ message, attributes });
      }));
    }
    return attributes;
  } catch (errorLoging) {
    bottleneck.schedule({}, () => Promise.resolve().then(() => {
      logger.customError({
        error: errorLoging,
        meta: {
          function: 'logger.customErrorr',
        },
      });
    }));
  }
};

module.exports = logger;