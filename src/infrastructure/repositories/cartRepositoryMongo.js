const Mongoose = require('../orm/mongoose/mongoose');
const MongooseCart = require('../orm/mongoose/schemas/CartSchema');
const MongooseProducts = require('../orm/mongoose/schemas/Products');
const ProductRepositoryMongo = require('../repositories/productRepositoryMongo');
const MongooseOrder = require('../orm/mongoose/schemas/OrderSchema');
const logger = require('../config/logs/logger');
// const this._clientId = '6099cd86f1dd766242d7ff2b';

module.exports = class {
  constructor({ clientId }) {
    this._clientId = clientId;
    this._findCartQuery = { clientId, status: 'Active' };
  }

  async getActiveCart() {
    try {
      const cart = await MongooseCart.findOne(this._findCartQuery).exec();
      return cart;
    } catch (error) {
      logger.error({ from: 'getActiveCart', error });
    }
  }
  
  addSingleProductToCart(productToPush) {
    return MongooseCart.updateOne(
      this._findCartQuery,
      {
        $set: { updatedAt: new Date() },
        $inc: { quantity: +1, total: +productToPush.price },
        $push: {
          products: productToPush,
        },
      },
      { upsert: true }
    ).exec();
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
        const productRepository = new ProductRepositoryMongo();
        let productUpdate = productRepository.reserveSingleProductToCart({ productId });
        const productToPush = { ...product, quantity: 1 };
        productToPush.productId = product._id;
        delete (productToPush._id);
        let cartUpdated = this.addSingleProductToCart(productToPush);
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
          'in_carts.clientId': this._clientId,
          quantityAvailable: { $gte: 1 },
        },
      )).toObject();

      if (!product) {
        throw new Error('Invalid product');
      }

      if (product.quantityAvailable < quantity) {
        throw new Error('Not enough quantity available for this item');
      }
      const cartDbItem = await MongooseCart.findOne(this._findCartQuery, { products: 1 }).exec();
      let cart = cartDbItem.toObject();
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
        const productRepository = new ProductRepositoryMongo();
        const productAddedParams = { productId, clientId: this._clientId, cartProduct, quantityAdded: quantity };
        await productRepository.updateProductAfterAddInCart(productAddedParams)

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
          { clientId: this._clientId, status: 'Active' },
          {
            $pull: { products: { productId } },
            $inc: { quantity: -currentProduct.quantity, total: -currentProduct.price },
            $set: { updatedAt: new Date() },
          }
        ).exec();
        const productRepository = new ProductRepositoryMongo();
        const reservedProduct = { productId, quantity: currentProduct.quantity, clientId: this._clientId };
        await productRepository.removeProductReservation(reservedProduct);
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
        const productRepository = new ProductRepositoryMongo();
        await productRepository.confirmClientProductsPurchase({ clientId: this._clientId, productIds });
        // await MongooseProducts.updateMany(
        //   {
        //     _id: { $in: productIds },
        //     'in_carts.clientId': this._clientId,
        //   },
        //   {
        //     $pull: { in_carts: { clientId: this._clientId } },
        //   }
        // ).exec();

        await MongooseCart.updateOne(this._findCartQuery, { status: 'Inactive' }).exec();
      }

      return orderCreated;
    } catch (error) {
      logger.error({ from: 'checkout', error });
      throw error;
    }
  }
};
