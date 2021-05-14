require('dotenv').config();
const database = require('./orm/mongoose/mongoose');
const server = require('./config/bin/www');

module.exports = { server, database };