const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
} = require('graphql');

const CurrencyType = new GraphQLObjectType({
  name: 'CurrencyType',
  description: 'Currency definition, contains currency name and the label used.',
  fields: {
    name: { type: GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
  }
});

module.exports = {
  CurrencyType,
};
