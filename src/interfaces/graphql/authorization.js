const logger = require('../../infrastructure/config/logger/logger');

const authorization = (resolve, params) => {
  const { obj, args, context } = params;
  try {
    if (context) {
      const { user } = context.meta;
      if (user.permissions && user.user_type === 'customer') {
        const allPermissionsFilled = user.permissions.all;
        /** It will be tested the !featuresCode && !accessLevel to check if is not necessary permissions  */
        if (allPermissionsFilled) {
          return resolve(obj, args, context);
        }
      }
    }
    throw new Error('Invalid context');
  } catch (error) {
    logger.error({ error, from: 'graphql/authorization' });
    throw error;
  }
};

module.exports = {
  authorization,
};
