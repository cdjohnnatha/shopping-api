const express = require('express');

const { graphqlMiddleware } = require('../middlewares/graphql-middleware');

const router = express.Router();

const publicMiddlewares = [
    graphqlMiddleware,
];

router.use('/api', publicMiddlewares);
module.exports = router;