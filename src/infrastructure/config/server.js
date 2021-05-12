const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { defaultErrorHandler } = require('../../interfaces/middlewares/errors-middleware');
const routes = require('../../interfaces/routes/index');
const cors = require('./cors');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors);
app.use(routes);
app.use(defaultErrorHandler);

module.exports = app;
