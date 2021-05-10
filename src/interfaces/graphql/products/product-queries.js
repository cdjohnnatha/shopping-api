// const { authorization, accessLevels } = require('../../authorization');
const { ProductsPaginated } = require('./product-types');
const { PaginationInputType } = require('../common/pagination/pagination-input-types');
const { productsPaginatedResolver } = require('./product-resolvers');


const ProductsQueries = {
  productsPaginated: {
    type: ProductsPaginated,
    description: 'This query gets the beneficiaries by a specific customer.',
    args: {
      pagination: { type: PaginationInputType }
    },
    resolve: productsPaginatedResolver
  },
};

module.exports = ProductsQueries;