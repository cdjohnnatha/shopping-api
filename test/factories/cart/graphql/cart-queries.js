const { queryString } = require('../../../support/graphql-helpers');
const { CartFieldsType } = require('./cart-types');

const activeCart = (input, output) => {
  let inputQuery = input;
  let outputQuery = output;
  
  if (!outputQuery) {
    outputQuery = `
      ${CartFieldsType}
    `;
  }
  return queryString('activeCart', inputQuery, outputQuery);
};

module.exports = {
  activeCart,
};
