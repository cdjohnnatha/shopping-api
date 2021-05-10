const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const ProductsQueries = require('./products/product-queries');
/**
 * This instance is reponsible for define all the GraphQL queries for customers and
 * mutations available.
 * - Path: /src/graphql/schema.js
 * @function customerSchema
 * @type {GraphQLSchema}
 * @const
 */
const publicSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      ...ProductsQueries,
    },
  }),
//   mutation: new GraphQLObjectType({
//     name: 'mutation',
//     fields: {
//       ...customerMutations,
//     },
//   }),
});

module.exports = {
    publicSchema,
};