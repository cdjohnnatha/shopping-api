const mongoose = require('mongoose');
const logger = require('../../config/logs/logger');

class MongooseSingleton {
  constructor() {
    this._MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
    this._MONGO_PORT = process.env.MONGO_PORT || '27017';
    this._MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'shopping';
    if (process.env.NODE_ENV === 'test') {
      this._MONGO_DB_NAME = 'test';
    }
    this._DB_URI = `mongodb://${this._MONGO_HOST}:${this._MONGO_PORT}/${this._MONGO_DB_NAME}`;

    this._mongooseSettings = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    this.connect();
  }

  connect() {
    const DB_URI = this._DB_URI;
    const isMongooseDisconnected = mongoose.connection.readyState === 0;
    if (isMongooseDisconnected) {
      mongoose.connect(this._DB_URI, this._mongooseSettings);
      mongoose.connection.on('connected', function () {
        logger.info(`Mongoose default connection open to ${DB_URI}`);
      });
      this.setCustomMongooseEvents();
    }
  }

  setCustomMongooseEvents() {
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
  }

  get instance() {
    return mongoose;
  }

  get connection() {
    return mongoose.connection;
  }

  get db() {
    return mongoose.connection.db;
  }

  async isPipelineLastErrorUpdatedExisting() {
    const productPipelineError = await mongoose.connection.db.command({ getLastError: 1 });
    logger.debug(productPipelineError);
    return productPipelineError.updatedExisting;
  }
}



module.exports = new MongooseSingleton();
