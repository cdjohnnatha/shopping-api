/* eslint-disable camelcase */
const User = require('../../domain/userDomain/User');


const sessionAuthorizationMiddleware = async (req, _res, next) => {
    /** Should verify a token and autorize an user */
    req.meta = {};
    req.meta.user = {
      clientId: User.clientId,
      user_type: 'customer',
      permissions: { all: true }
    };
    next();
};

module.exports = {
  sessionAuthorizationMiddleware
};