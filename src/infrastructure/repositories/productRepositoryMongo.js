const Mongoose = require('../orm/mongoose/mongoose');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const logger = require('../config/logs/logger');

module.exports = class {
  constructor() {}

  async getAll(pagination) {
    const { rowsPerPage, currentPage } = pagination;
    let products = MongooseProducts.find().limit(rowsPerPage).skip(currentPage);
    let totalProducts = MongooseProducts.estimatedDocumentCount();
    [products, totalProducts] = await Promise.all([products, totalProducts]);
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
      _id: { $in: formattedIds },
    };
    let products = await MongooseProducts.find(filterQuery);
    return products;
  }

  updateProductAfterAddInCart({productId, clientId, quantityAdded, cartProduct}) {
    return MongooseProducts.updateOne(
      {
        _id: Mongoose.toObjectId(productId),
        'in_carts.clientId': clientId,
        quantityAvailable: { $gte: 1 },
      },
      {
        $inc: { quantityAvailable: -1 * quantityAdded },
        $set: {
          'in_carts.$.quantity': quantityAdded + cartProduct.quantity,
          timestamp: new Date(),
        },
      }
    );
  }

  reserveSingleProductToCart({ productId }) {
    return MongooseProducts.updateOne(
      { _id: productId, quantityAvailable: { $gte: 1 } },
      {
        $inc: { quantityAvailable: -1 },
        $push: {
          in_carts: {
            quantity: 1,
            clientId: this._clientId,
            timestamp: new Date(),
          },
        },
      }
    ).exec();
  }

  removeProductReservation({ productId, quantity, clientId }) {
    return MongooseProducts.updateOne(
      { _id: Mongoose.toObjectId(productId) },
      {
        $inc: { quantityAvailable: +quantity },
        $pull: { in_carts: { clientId } },
      }
    ).exec();
  }

  confirmClientProductsPurchase({ clientId, productIds }) {
    return MongooseProducts.updateMany(
      {
        _id: { $in: productIds },
        'in_carts.clientId': clientId,
      },
      {
        $pull: { in_carts: { clientId } },
      }
    ).exec();
  }
};
