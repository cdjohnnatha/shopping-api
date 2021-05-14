const { graphqlHTTP } = require('express-graphql');

const logger = require('../../infrastructure/config/logs/logger');
const { publicSchema } = require('../graphql/schema');

/**
 * It is set by default to not show the graphiql interface to be used in prod env.
 * When it is other enviroments, it will be showed.
 */
let graphiql = false;
if (process.env.NODE_ENV !== 'prod') graphiql = true;

/**
 * @function formatGraphqlErrorMessages
 * @description It will format the error message to be showed.
 * @param {Object} err - GraphqlError
 */
const formatGraphqlErrorMessages = (error) => {
  const { path, extensions  } = error;

  logger.customError({
    error,
    meta: {
      function: 'formatGraphqlErrorMessages',
      error_type: 'GRAPHQL_RESOLVER',
      error_group: 'SYSTEM_ERROR',
      path: path || '',
      extensions,
    },
  });
  return error;
};


const graphqlMiddleware = graphqlHTTP(req => ({
  schema: publicSchema,
  graphiql,
  context: {
    ...req,
    id: req.id,
    ip: req.ip,
    device_data: req.device_data,
    index: req.index,
    user: req.user,
  },
  customFormatErrorFn: formatGraphqlErrorMessages,
}));

module.exports = {
  graphqlMiddleware,
};