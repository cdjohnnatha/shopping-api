const ProductFieldsType = `
  _id
  name
  maxQuantityPerCustomer
  category
  description
  price
  images {
    path
    tags
    size
    type
  }
  currency {
    name
    label
  }
`;
const ProductType = `
  product{ ${ProductFieldsType} }
`;

module.exports = {
  ProductType,
  ProductFieldsType,
};