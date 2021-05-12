const {
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');

const ProductFilterInputType = new GraphQLInputObjectType({
  name: 'productFilterInputType',
  description: 'Inputs used to filter products .',
  fields: {
    idList: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
  }
});


module.exports = {
  ProductFilterInputType,
}