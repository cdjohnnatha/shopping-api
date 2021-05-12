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
const Factories = require('../factories/index');
const ProductsSharedExamples = require('../support/sharedExamples/productsSharedExamples');
const PaginationSharedExamples = require('../support/sharedExamples/paginationSharedExamples');
const GraphqlSharedExamples = require('../support/sharedExamples/graphqlSharedExamples');

const { expect } = chai;
chai.use(chaiHttp);

describe('Products', () => {
  beforeEach(async () => {
    await Factories.factory.create('Product', {}, { });
  });
  after(async () => {
    await Factories.factory.cleanUp();
  });

  it('Get products paginated', async () => {
    const response = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsPaginated() });
    expect(response).to.have.status(200);
    const { products } = response.body.data.productsPaginated;
    const productShanredExamples = new ProductsSharedExamples(products);
    const paginationSharedExamples = new PaginationSharedExamples(response.body.data.productsPaginated);
    productShanredExamples.shouldBehaveLikeProduct();
    paginationSharedExamples.shouldBehaveLikePaginated();
  });

  // it('Get products without pagination, should get an error', async () => {
  //   const inputParams = {};
  //   const response = await chai
  //     .request(server)
  //     .post(API_URL)
  //     .send({ query: productsPaginated(inputParams) });
  //   expect(response).to.have.status(400);
  //   expect(response.error).to.exist;
  //   const graphqlSharedExamples = new GraphqlSharedExamples({ error: response.error, queryName: 'productsPaginated' });
  //   graphqlSharedExamples.shouldBehaveLikeMissingArgumentsGraphqlError();
  // });
});