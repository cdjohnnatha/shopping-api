
const Mongoose = require('../orm/mongoose/mongoose');
const MongooseCart = require('../orm/mongoose/schemas/CartSchema');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const logger = require('../config/logs/logger');
const defaultClientId = "6099cd86f1dd766242d7ff2b";

module.exports = class {
  constructor() {
    this._clientId = defaultClientId;
    this._findCartQuery = { clientId: defaultClientId, status: 'Active' };
  }

  async getActiveCart() {
    try {
      const cart = await MongooseCart.findOne(this._findCartQuery).exec();
      return cart;
    } catch (error) {
      logger.error({ from: 'getActiveCart', error });
    }
  }

  async addCartItem({ productId }) {
    try {
      const productParams = await MongooseProducts.findById(productId, { price: 1, name: 1 }).exec();
      const productToPush = { ...productParams._doc, quantity: 1 };
      let cartUpdated = MongooseCart.updateOne(
        this._findCartQuery,
        {
          $set: { updatedAt: new Date() },
          $inc: { quantity: +1, total: +productParams._doc.price },
          $push: {
            products: productToPush
          },
        },
        { upsert: true }
      ).exec();


      let productUpdate = MongooseProducts.updateOne({ _id: productId, quantityAvailable: { $gte: 1, } }, {
        $inc: { quantityAvailable: -1 },
        $push: {
          in_carts: {
            quantity: 1, clientId: defaultClientId, timestamp: new Date()
          }
        }
      }).exec();

      ([cartUpdated, productUpdate] = await Promise.all([cartUpdated, productUpdate]));
      const productWasUpdated = await Mongoose.isPipelineLastErrorUpdatedExisting();
      if (!productWasUpdated) {
        await MongooseCart.updateOne({
          clientId: defaultClientId, status: "Active"
        },
          {
            $pull: { products: { _id: Mongoose.instance.Types.ObjectId(productId) } },
            $inc: { quantity: -1 },
            $inc: { total: -productParams.price },
          });
        throw new Error('It has not enough available items');
      }
      const cart = await MongooseCart.findOne(this._findCartQuery).exec();
      return cart;
    } catch (error) {
      logger.error({ from: 'addCartItem', error });
      throw error;
    }
  }

  async updateCartItemQuantity({ productId, quantity }) {
    try {

      const cart = await MongooseCart.findOne(this._findCartQuery, { products: 1 }).exec();
      let currentProduct = null;
      for (const { _doc: product } of cart.products) {
        if (product._id.toString() === productId) {
          currentProduct = product;
          break;
        }
      }
      if (currentProduct) {
        const oldQuantity = currentProduct.quantity;
        const quantityDiff = quantity - oldQuantity;
        const cartItemQuery = {
          ...this._findCartQuery,
          "products._id": productId,
        };

        await MongooseCart.updateOne(cartItemQuery, {
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
          $inc: { quantity: (-1) * quantityDiff },
          $set: {
            "in_carts.$.quantity": quantity, timestamp: new Date()
          }
        });

        const productWasUpdated = await Mongoose.isPipelineLastErrorUpdatedExisting();
        if (!productWasUpdated) {
          await MongooseCart.updateOne(
            { ...this._findCartQuery, 'products._id': productId },
            {
              $set: { "in_carts.$.quantity": oldQuantity }
            });
        }
        const cartUpdated = MongooseCart.findOne(this._findCartQuery);
        return cartUpdated;
      }
      throw new Error('Product not found in cart');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async removeCartItem({ productId }) {
    try {

      const cart = await MongooseCart.findOne(this._findCartQuery, { products: 1, quantity: 1 }).exec();
      let currentProduct = null;

      for (const { _doc: product } of cart.products) {
        if (product._id.toString() === productId) {
          currentProduct = product;
          break;
        }
      }
      if (currentProduct) {
        await MongooseCart.updateOne(
          { clientId: defaultClientId, status: "Active" },
          {
            $pull: { products: { _id: Mongoose.instance.Types.ObjectId(productId) } },
            $inc: { quantity: -currentProduct.quantity, total: -currentProduct.price },
            $set: { updatedAt: new Date() }
          }
        ).exec();



        await MongooseProducts.updateOne({
          _id: productId,
          "in_carts.id": defaultClientId,
          quantity: { $gte: 1 }
        }, {
          $inc: { quantity: +currentProduct.quantity },
          $pull: { in_carts: { clientId: Mongoose.instance.Types.ObjectId(this._clientId) } },
        }).exec();

        const productWasUpdated = await Mongoose.isPipelineLastErrorUpdatedExisting();
        if (!productWasUpdated) {
          await MongooseCart.updateOne(
            { ...this._findCartQuery, 'products._id': productId },
            {
              $set: { "in_carts.$.quantity": oldQuantity }
            });
        }
        const cartUpdated = await MongooseCart.findOne(this._findCartQuery).exec();
        return cartUpdated;
      }
      throw new Error('Product not found in cart');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async checkout({ payment }) {
    try {


        // return cartUpdated;
      }
      throw new Error('Product not found in cart');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}