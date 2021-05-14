const { PaginationType } = require('../../paginated/pagination-type');
const { queryString } = require('../../../support/graphql-helpers');
const { ProductType, ProductFieldsType } = require('./product-types');
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

const productsFilterQuery = (input, output) => {
  let inputQuery = input;
  let outputQuery = output;
  if (!inputQuery) {
    inputQuery = paginationInputType();
  }
  if (!outputQuery) {
    outputQuery = `
      ${ProductFieldsType}
      in_carts {
        clientId
        quantity
      }
    `;
  }
  return queryString('productsFilter', inputQuery, outputQuery);
};

module.exports = {
  productsPaginated,
  productsFilterQuery,
};
