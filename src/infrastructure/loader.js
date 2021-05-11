require('dotenv').config();
require('./orm/mongoose/mongoose');
const server = require('./config/bin/www');

module.exports = { server };