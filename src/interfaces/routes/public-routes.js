const express = require('express');
const path = require('path');

const { graphqlMiddleware } = require('../middlewares/graphql-middleware');

const router = express.Router();

const publicMiddlewares = [
    graphqlMiddleware,
];

router.use('/api', publicMiddlewares);
router.use('/images', express.static(path.join(__dirname, '/../../../public/images')));

module.exports = router;