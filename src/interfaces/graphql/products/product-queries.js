const { GraphQLList } = require('graphql');
const { ProductsPaginated, ProductType } = require('./product-types');
const { ProductFilterInputType } = require('./product-input-types');
const { PaginationInputType } = require('../common/pagination/pagination-input-types');
const { productsPaginatedResolver, productsFilterResolver } = require('./product-resolvers');


const ProductsQueries = {
  productsPaginated: {
    type: ProductsPaginated,
    description: 'This query gets the beneficiaries by a specific customer.',
    args: {
      pagination: { type: PaginationInputType }
    },
    resolve: productsPaginatedResolver
  },
  productsFilter: {
    type: GraphQLList(ProductType),
    description: 'This query a products list from filter.',
    args: {
      filters: { type: ProductFilterInputType }
    },
    resolve: productsFilterResolver
  },
};

module.exports = ProductsQueries;