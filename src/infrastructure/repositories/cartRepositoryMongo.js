const Mongoose = require('../orm/mongoose/mongoose');
const MongooseCart = require('../orm/mongoose/schemas/CartSchema');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const MongooseOrder = require('../orm/mongoose/schemas/OrderSchema');
const logger = require('../config/logs/logger');
const defaultClientId = '6099cd86f1dd766242d7ff2b';

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
      const findProductQuery = { _id: productId, quantityAvailable: { $gte: 1 } };
      let product = await MongooseProducts.findOne(findProductQuery, {
        price: 1,
        name: 1,
      }).exec();
      
      if (product) {
        product = product.toObject();
        let productUpdate = MongooseProducts.updateOne(
          { _id: productId, quantityAvailable: { $gte: 1 } },
          {
            $inc: { quantityAvailable: -1 },
            $push: {
              in_carts: {
                quantity: 1,
                clientId: defaultClientId,
                timestamp: new Date(),
              },
            },
          }
        ).exec();

        const productToPush = { ...product, quantity: 1 };
        productToPush.productId = product._id;
        delete (productToPush._id)
        let cartUpdated = MongooseCart.updateOne(
          this._findCartQuery,
          {
            $set: { updatedAt: new Date() },
            $inc: { quantity: +1, total: +product.price },
            $push: {
              products: productToPush,
            },
          },
          { upsert: true }
        ).exec();
        [productUpdate, cartUpdated] = await Promise.all([cartUpdated, productUpdate]);
      
      const cart = await MongooseCart.findOne(this._findCartQuery).exec();
      return cart.toObject();
      }
      throw new Error('It has not enough available items');
    } catch (error) {
      logger.error({ from: 'addCartItem', error });
      throw error;
    }
  }

  async updateCartItemQuantity({ productId, quantity }) {
    try {
      
      const product = (await MongooseProducts.findOne(
        {
          _id: Mongoose.instance.Types.ObjectId(productId),
          'in_carts.clientId': defaultClientId,
          quantityAvailable: { $gte: 1 },
        },
      )).toObject();

      if (!product) {
        throw new Error('Invalid product');
      }

      if (product.quantityAvailable < quantity) {
        throw new Error('Not enough quantity available for this item');
      }
      // if (currentProduct.quantityAvailable < quantity) {
      //   throw new Error('Not enough available quantity for this item');
      // }
      const cart = (await MongooseCart.findOne(this._findCartQuery, { products: 1 }).exec()).toObject();
      let cartProduct = null;
      for (const product of cart.products) {
        if (product.productId.toString() === productId) {
          cartProduct = product;
          break;
        }
      }
      if (cartProduct) {
        const oldQuantity = cartProduct.quantity;
        const quantityDiff = quantity - oldQuantity;
        const cartItemQuery = {
          ...this._findCartQuery,
          'products.productId': productId,
        };

        await MongooseCart.updateOne(cartItemQuery, {
          $inc: {
            total: +(quantity * cartProduct.price),
            'products.$.quantity': quantity + cartProduct.quantity,
            'quantity': +quantity,
          },
          $set: {
            updatedAt: new Date(),
          },
        }).exec();

        await MongooseProducts.updateOne(
          {
            _id: Mongoose.instance.Types.ObjectId(productId),
            'in_carts.clientId': defaultClientId,
            quantityAvailable: { $gte: 1 },
          },
          {
            $inc: { quantityAvailable: -1 * quantity },
            $set: {
              'in_carts.$.quantity': quantity + cartProduct.quantity,
              timestamp: new Date(),
            },
          }
        );

        const cartUpdated = await MongooseCart.findOne(this._findCartQuery);
        return cartUpdated.toObject();
      }
      throw new Error('Product not found in cart');
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async removeCartItem({ productId }) {
    try {
      const cart = await MongooseCart.findOne(this._findCartQuery, {
        products: 1,
        quantity: 1,
      }).exec();
      let currentProduct = null;

      for (const { _doc: product } of cart.products) {
        if (product.productId.toString() === productId) {
          currentProduct = product;
          break;
        }
      }
      if (currentProduct) {
        await MongooseCart.updateOne(
          { clientId: defaultClientId, status: 'Active' },
          {
            $pull: { products: { productId } },
            $inc: { quantity: -currentProduct.quantity, total: -currentProduct.price },
            $set: { updatedAt: new Date() },
          }
        ).exec();

        await MongooseProducts.updateOne(
          { _id: Mongoose.instance.Types.ObjectId(productId) },
          {
            $inc: { quantityAvailable: +currentProduct.quantity },
            $pull: { in_carts: { clientId: this._clientId } },
          }
        ).exec();

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
      const cart = await MongooseCart.findOne(this._findCartQuery).exec();
      const { creditCardNumber } = payment;
      const last4DigitsCreditCart = creditCardNumber.substr(creditCardNumber.length - 4);
      const cardWhiteList = ['8889'];
      const isPaymentApproved = cardWhiteList.includes(last4DigitsCreditCart);
      const orderPayment = {
        paymentCardType: isPaymentApproved ? 'Master' : 'Visa',
        paymentStatus: isPaymentApproved ? 'Paid' : 'Refused',
      };
      const products = [];
      const productIds = [];
      for (const product of cart.products) {
        products.push(product._doc);
        const productId = Mongoose.instance.Types.ObjectId(product._doc.productId);
        productIds.push(productId);
      }
      const order = {
        payment: orderPayment,
        products,
        clientId: this._clientId,
        cartId: cart._id,
        total: cart.total,
      };
      if (order.products.length <= 0) {
        throw new Error('It is necesary to have products in cart');
      }

      const orderCreated = (await MongooseOrder.create(order)).toObject();

      if (isPaymentApproved) {
        await MongooseProducts.updateMany(
          {
            _id: { $in: productIds },
            'in_carts.clientId': this._clientId,
          },
          {
            $pull: { in_carts: { clientId: this._clientId } },
          }
        ).exec();

        await MongooseCart.updateOne(this._findCartQuery, { status: 'Inactive' }).exec();
      }

      return orderCreated;
    } catch (error) {
      logger.error({ from: 'checkout', error });
      throw error;
    }
  }
};
