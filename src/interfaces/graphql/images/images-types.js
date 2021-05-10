const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
} = require('graphql');

const ImageEnumType = new GraphQLEnumType({
  name: 'ImageEnumType',
  description: 'Image types used around ecommerce application such as list, full image, thumbnail.',
  values: {
    LIST: { value: 'list' },
    FULL: { value: 'full' },
    THUMBNAIL: { value: 'thumbnail' },
  },
});


const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  description: 'Attributes available to images.',
  fields: {
    path: { type: GraphQLString },
    tags: { type: GraphQLString },
    size: { type: GraphQLString },
    type: { type: ImageEnumType },
  }
});

module.exports = {
  ImageType,
}