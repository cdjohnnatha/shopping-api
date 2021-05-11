
const Mongoose = require('../orm/mongoose/mongoose');
const MongooseCart = require('../orm/mongoose/schemas/CartSchema');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const logger = require('../config/logs/logger');
const defaultClientId = "6099cd86f1dd766242d7ff2b";
module.exports = class {
  constructor() { }

  async addCartItem({ product }) {
    const db = Mongoose.connection;
    const { productId } = product;
    try {
      const productParams = await MongooseProducts.findById(product.productId, { price: 1, name: 1 }).exec();
      const productToPush = { ...productParams._doc, quantity: 1 };
      let cartUpdate = MongooseCart.updateOne(
        { clientId: defaultClientId, status: 'Active' },
        {
          $set: { updatedAt: new Date() },
          $push: {
            products: productToPush
          }
        }).exec();


      let productUpdate = MongooseProducts.updateOne({ _id: product.productId, quantityAvailable: { $gte: 1, } }, {
        $inc: { quantityAvailable: -1 },
        $push: {
          in_carts: {
            quantity: 1, clientId: defaultClientId, timestamp: new Date()
          }
        }
      }).exec();

      ([cartUpdate, productUpdate] = await Promise.all([cartUpdate, productUpdate]));
      Mongoose.connection.db.command()

      const productPipelineError = await Mongoose.connection.db.command({ getLastError: 1 });
      const productWasUpdated = productPipelineError.updatedExisting;
      if (!productWasUpdated) {
        await MongooseCart.updateOne({
          clientId: defaultClientId, status: "Active"
        }, {
          $pull: { products: { _id: Mongoose.Types.ObjectId(productId) } }
        })
      }
      return true;
    } catch (error) {
      logger.error({ from: 'addCartItem', db, error });
      return false;
    }
  }

  async updateCartItemQuantity({ cartId, productId, quantity }) {
    try {

      const cart = await MongooseCart.findById(cartId, { products: 1 }).exec();
      let currentProduct = null;
      for (const { _doc: product } of cart.products) {
        if (product._id.toString() === productId) {
          currentProduct = product;
          break;
        }
      }
      const oldQuantity = currentProduct.quantity;
      const quantityDiff = quantity - oldQuantity;
      const query = {
        _id: cartId,
        "products._id": productId,
        status: "Active"
      };
      const updateadCartItem = await MongooseCart.updateOne(query, {
        $set: {
          updatedAt: new Date(),
          "products.$.quantity": quantity
        }
      }).exec();

      MongooseProducts.updateOne({
        _id: productId,
        "in_carts.id": defaultClientId,
        quantity: { $gte: 1 }
      }, {
        $inc: { quantity: (-1)*quantityDiff },
        $set: {
          "in_carts.$.quantity": quantity, timestamp: new ISODate()
        }
      });

      const productPipelineError = await Mongoose.connection.db.command({ getLastError: 1 });
      const productWasUpdated = productPipelineError.updatedExisting;
      if (!productWasUpdated) {
        await MongooseCart.updateOne({
          clientId: defaultClientId, 'products._id': productId,
        }, {
          $set : { "in_carts.$.quantity": oldQuantity}
        });
      }
    } catch (error) {
      logger.error(error);
    }
  }
}