const logger = require('../../../infrastructure/config/logs/logger');
const CartRepositoryMongo = require('../../../infrastructure/repositories/cartRepositoryMongo');

const activeCartResolver = async (_obj, _args, context) => {
  try {
    const { user } = context.meta;
    const cartRepositoryMongo = new CartRepositoryMongo({ clientId: user.clientId });
    const cart = await cartRepositoryMongo.getActiveCart();
    return cart;
  } catch (error) {
    logger.error({ error, errorFrom: 'productsPaginatedResolver' });
    throw error;
  }
}

const cartCheckoutResolver = async (_obj, args, context) => {
  try {
    const { user } = context.meta;
    const cartRepositoryMongo = new CartRepositoryMongo({ clientId: user.clientId });
    const order = await cartRepositoryMongo.checkout(args);
    return order;
  } catch (error) {
    logger.error({ error, errorFrom: 'productsPaginatedResolver' });
    throw error;
  }
}

module.exports = {
  activeCartResolver,
  cartCheckoutResolver,
};
