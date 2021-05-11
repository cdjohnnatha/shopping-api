/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const { productsPaginated } = require('../factories/products/graphql/product-queries');
const { API_URL } = require('../support/sharedConsts');
const { server } = require('../../src/infrastructure/loader');
const {
  buildGraphqlInputFromObject,
  getResultFromQuery,
  buildMultipleInputObjects,
} = require('../support/graphql-helpers');
// const { CleanCustomers } = require('../../support/database-helper');

const { expect } = chai;
chai.use(chaiHttp);

describe('Products', () => {
  beforeEach(async () => {
    // validParams = await factories.build('Product', {}, { attributes: true });
    // validParams = { beneficiary: buildGraphqlInputFromObject(validParams) };
  });
  it('Get products paginated', async () => {
    const response = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsPaginated() });
    console.log('response.body', response);
    expect(response).to.have.status(200);
  });
});