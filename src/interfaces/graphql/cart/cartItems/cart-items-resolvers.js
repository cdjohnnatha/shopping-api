
const logger = require('../../../../infrastructure/config/logs/logger')
const CartRepositoryMongo = require('../../../../infrastructure/repositories/cartRepositoryMongo');

const AddCartItemResolver = async (_obj, args, context) => {
  try {
    const { cartItem } = args;
    const cartRepository = new CartRepositoryMongo();
    const cart = await cartRepository.addCartItem(cartItem);
    return cart;
  } catch (error) {
    logger.error({ error, errorFrom: 'AddCartItemResolver', context });
    throw error;
  }
};

const UpdateCartItemQuantityResolver = async (_obj, args, context) => {
  try {
    const { cartItem } = args;
    const cartRepository = new CartRepositoryMongo();
    const updatedCart = await cartRepository.updateCartItemQuantity(cartItem);
    return updatedCart;
  } catch (error) {
    logger.error({ error, errorFrom: 'UpdateCartItemQuantityResolver', context });
    throw error;
  }
};

const RemoveCartItemResolver = async (_obj, args, context) => {
  try {
    const { productId } = args;
    const cartRepository = new CartRepositoryMongo();
    const updatedCart = await cartRepository.removeCartItem({ productId });
    return updatedCart;
  } catch (error) {
    logger.error({ error, errorFrom: 'UpdateCartItemQuantityResolver', context });
    throw error;
  }
};

module.exports = {
  AddCartItemResolver,
  UpdateCartItemQuantityResolver,
  RemoveCartItemResolver,
}