const Mongoose = require('../orm/mongoose/mongoose');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const logger = require('../config/logs/logger');

module.exports = class {
  constructor() {
  }

  async getAll(pagination) {
    const { rowsPerPage, currentPage } = pagination;
    let products = MongooseProducts.find().limit(rowsPerPage).skip(currentPage);
    let totalProducts = MongooseProducts.estimatedDocumentCount();
    ([products, totalProducts] = await Promise.all([products, totalProducts]));
    return { products, totalProducts };
  }

  async bulkCreate(products) {
    try {
      const result = await MongooseProducts.insertMany(products);
      return result;
    } catch (error) {
      logger.error(error);
    }
  }

  async filter(filterParams) {
    const { idList } = filterParams;
    const formattedIds = [];
    for (let id of idList) {
      const mongoId = Mongoose.instance.Types.ObjectId(id);
      formattedIds.push(mongoId);
    }
    const filterQuery = {
      _id: { $in : formattedIds }
    };
    let products = await MongooseProducts.find(filterQuery);
    return products;
  }
}