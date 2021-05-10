const {
  GraphQLObjectType,
  GraphQLInt,
} = require('graphql');

const PaginationType = new GraphQLObjectType({
  name: 'PaginationType',
  description: 'It represents the pagination response structure.',
  fields: {
    totalPages: {
      type: GraphQLInt,
    },
    totalValues: {
      type: GraphQLInt,
    },
    rowsPerPage: {
      type: GraphQLInt,
    },
    currentPage: {
      type: GraphQLInt,
    },
  },
});

module.exports = {
  PaginationType,
}