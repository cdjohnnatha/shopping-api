const CartItemType = `
    productId
    price
    quantity
`;

const CartFieldsType = `
  _id
  quantity
  total
  status
  products {
      ${CartItemType}
  } 
`;

module.exports = {
  CartItemType,
  CartFieldsType,
};
