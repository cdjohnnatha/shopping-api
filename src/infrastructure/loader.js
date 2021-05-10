require('dotenv').config();
const server = require('./config/bin/www');
require('./orm/mongoose/mongoose');

module.exports = { server };