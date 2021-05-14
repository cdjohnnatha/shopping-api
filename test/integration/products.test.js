/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  productsPaginated,
  productsFilterQuery,
} = require('../factories/products/graphql/product-queries');
const DatabaseCleaner = require('database-cleaner');
const databaseCleaner = new DatabaseCleaner('mongodb');
const { API_URL } = require('../support/sharedConsts');
const { server, database } = require('../../src/infrastructure/loader');
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
  before(async () => {
    await Factories.factory.createMany('Product', 20);
  });
  after(async () => {
    databaseCleaner.clean(database.db);
  });

  it('Get products paginated', async () => {
    const response = await chai.request(server).post(API_URL).send({ query: productsPaginated() });
    expect(response).to.have.status(200);
    const { products } = response.body.data.productsPaginated;
    const productShanredExamples = new ProductsSharedExamples(products);
    const paginationSharedExamples = new PaginationSharedExamples(
      response.body.data.productsPaginated
    );
    productShanredExamples.shouldBehaveLikeProduct();
    paginationSharedExamples.shouldBehaveLikePaginated();
  });

  it('Get products without pagination, should get an error', async () => {
    const inputParams = {};
    const response = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsPaginated(inputParams) });
    expect(response).to.have.status(400);
    expect(response.error).to.exist;
    const graphqlSharedExamples = new GraphqlSharedExamples({
      error: response.body.errors,
      queryName: 'productsPaginated',
    });
    graphqlSharedExamples.shouldBehaveLikeMissingArgumentsGraphqlError();
  });

  it('Change pagination products', async () => {
    let pagination = buildGraphqlInputFromObject({ rowsPerPage: 10, currentPage: 1 });
    pagination = `pagination: { ${pagination} }`;
    const response = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsPaginated(pagination) });
    expect(response).to.have.status(200);
    const productsPaginatedResult = getResultFromQuery(response.body);
    const productSharedExamples = new ProductsSharedExamples(productsPaginatedResult.products);
    const paginationSharedExamples = new PaginationSharedExamples(productsPaginatedResult);
    productSharedExamples.shouldBehaveLikeProduct();
    paginationSharedExamples.shouldBehaveLikePaginated();
    expect(productsPaginatedResult.pagination.currentPage).to.be.eq(1);
  });

  it('Filter product', async () => {
    const product = await Factories.factory.create('Product');
    const filterProductInput = `filters: { idList: ["${product._id}"] }`;
    const response = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(filterProductInput) });
    expect(response).to.have.status(200);
    const productsFiltered = getResultFromQuery(response.body);
    const productSharedExamples = new ProductsSharedExamples(productsFiltered);
    productSharedExamples.shouldBehaveLikeProduct();
    expect(productsFiltered).to.an('Array');
    expect(productsFiltered.length).to.eq(1);
  });
});
