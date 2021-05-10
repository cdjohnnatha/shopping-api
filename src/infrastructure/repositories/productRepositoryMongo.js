const { count } = require('../orm/mongoose/schemas/Products');
const MongooseProducts = require('../orm/mongoose/schemas/Products');


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
}