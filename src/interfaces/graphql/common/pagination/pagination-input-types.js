const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const PaginationInputType = new GraphQLInputObjectType({
  name: 'PaginationInput',
  description: `It represents the pagination input structure. It represents
    how many objects will be listed.`,
  fields: {
    rowsPerPage: {
      type: GraphQLNonNull(GraphQLInt),
    },
    currentPage: {
      type: GraphQLNonNull(GraphQLInt),
    },
  },
});

module.exports = {
  PaginationInputType,
}