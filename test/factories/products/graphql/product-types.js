const ProductFieldsType = `
  _id
  name
  quantityAvailable
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
  products { ${ProductFieldsType} }
`;

module.exports = {
  ProductType,
  ProductFieldsType,
};