const express = require('express');
const { printSchema, buildSchema } = require('graphql');

const router = express.Router();
const { publicSchema } = require('../graphql/schema');
const publicRoutes = require('./public-routes');

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.get('/schema', (req, res) => res.json((printSchema(publicSchema))));
router.use('/', publicRoutes);

module.exports = router;
