const express = require('express');
const path = require('path');

const { graphqlMiddleware } = require('../middlewares/graphql-middleware');
const { sessionAuthorizationMiddleware } = require('../middlewares/session-authorization-middleware');

const router = express.Router();

const publicMiddlewares = [
    sessionAuthorizationMiddleware,
    graphqlMiddleware,
];

router.use('/api', publicMiddlewares);
router.use('/images', express.static(path.join(__dirname, '/../../../public/images')));

module.exports = router;