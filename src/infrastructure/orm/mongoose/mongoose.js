const mongoose = require('mongoose');
const logger = require('../../config/logs/logger');

let MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
let MONGO_PORT = process.env.MONGO_PORT || '27017';
let MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'shopping';
const DB_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

const mongooseSettings = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(DB_URI, mongooseSettings);

mongoose.connection.on('connected', function () {
  logger.info(`Mongoose default connection open to ${DB_URI}`);
});

mongoose.connection.on('error', function (err) {
  logger.error(`Mongoose default connection error:  ${err}`);
});

mongoose.connection.on('disconnected', function () {
  logger.debug('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
// require('./../model/team');