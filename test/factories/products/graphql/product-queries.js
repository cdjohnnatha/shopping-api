const { PaginationType } = require('../../paginated/pagination-type');
const { queryString } = require('../../../support/graphql-helpers');
const { ProductType } = require('./product-types');
const { paginationInputType } = require('../../paginated/pagination-input-type');

const productsPaginated = (input, output) => {
  let inputQuery = input;
  let outputQuery = output;
  if (!inputQuery) {
    inputQuery = paginationInputType();
  }
  if (!outputQuery) {
    outputQuery = `
      ${PaginationType}
      ${ProductType}
    `;
  }
  return queryString('productsPaginated', inputQuery, outputQuery);
};

module.exports = {
  productsPaginated,
};
