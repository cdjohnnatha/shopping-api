const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const { ImageType } = require('../images/images-types');
const { PaginationType } = require('../common/pagination/pagination-types');
const { CurrencyType } = require('../currency/currency-types');

const ProductType = new GraphQLObjectType({
  name: 'ProductType',
  description: 'Attributes definition for a product.',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    quantityAvailable: { type: GraphQLNonNull(GraphQLInt) },
    maxQuantityPerCustomer: { type: GraphQLNonNull(GraphQLInt) },
    category: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    images: { type: GraphQLNonNull(GraphQLList(ImageType)) },
    currency: { type: GraphQLNonNull(CurrencyType) }
  }
});

const ProductsPaginated = new GraphQLObjectType({
  name: 'ProductsPaginated',
  description: 'Attributes definition for a product list and pagination.',
  fields: {
    pagination: { type: PaginationType },
    products: { type: GraphQLList(ProductType) },
  }
});

module.exports = {
  ProductType,
  ProductsPaginated,
}