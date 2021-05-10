
const logger = require('../../../infrastructure/config/logs/logger')
const ProductRepositoryMongo = require('../../../infrastructure/repositories/productRepositoryMongo');
const Pagination = require('../../../domain/pagination');

const productsPaginatedResolver = async (_obj, args, context) => {
  try {
    const { pagination: paginationParams } = args;
    const productRepository = new ProductRepositoryMongo();
    const pagination = new Pagination(paginationParams);
    const { products, totalProducts } = await productRepository.getAll(paginationParams);
    pagination.totalValues = totalProducts;
    return { products, pagination: pagination.responsePagination };
  } catch (error) {
    logger.error({ error, errorFrom: 'productsPaginatedResolver', context });
    throw error;
  }
};

module.exports = {
  productsPaginatedResolver,
}