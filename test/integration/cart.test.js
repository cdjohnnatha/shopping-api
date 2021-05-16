/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const { activeCart } = require('../factories/cart/graphql/cart-queries');
const {
  addCartItemMutation,
  removeCartItemMutation,
  updateCartItemQuantityMutation,
  checkoutMutation,
} = require('../factories/cart/graphql/cart-items-mutations');
const { productsFilterQuery } = require('../factories/products/graphql/product-queries');
const { API_URL } = require('../support/sharedConsts');
const { server, database } = require('../../src/infrastructure/loader');
const {
  buildGraphqlInputFromObject,
  getResultFromQuery,
  buildMultipleInputObjects,
} = require('../support/graphql-helpers');
const Factories = require('../factories/index');
const CartSharedExamples = require('../support/sharedExamples/cartSharedExamples');
const ProductsSharedExamples = require('../support/sharedExamples/productsSharedExamples');
const DatabaseCleaner = require('database-cleaner');
const databaseCleaner = new DatabaseCleaner('mongodb');

const GraphqlSharedExamples = require('../support/sharedExamples/graphqlSharedExamples');
const ProductSchema = require('../../src/infrastructure/orm/mongoose/schemas/Products');
const { expect } = chai;
chai.use(chaiHttp);

let cartBeforeChanges = null;
let productFromCart = null;
let productBeforeChanges = null;
let filterProductInput = null;
describe('Carts', () => {
  before(async () => {
    const products = await Factories.factory.createMany('Product', 2, {}, { inCart: true });
    await Factories.factory.create('Cart', {}, { attachProduct: products });
  });
  after(async () => {
    databaseCleaner.clean(database.db);
  });

  beforeEach(async () => {
    const response = await chai.request(server).post(API_URL).send({ query: activeCart() });
    cartBeforeChanges = getResultFromQuery(response.body);
    productFromCart = cartBeforeChanges.products[0];
    filterProductInput = `filters: { idList: ["${productFromCart.productId}"] }`;
    const productFilteredResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(filterProductInput) });
    productBeforeChanges = getResultFromQuery(productFilteredResponse.body);
    const cartSharedExamples = new CartSharedExamples(cartBeforeChanges);
    cartSharedExamples.shouldBehaveLikeCart();
  });

  it('Get a cart with products', async () => {
    const response = await chai.request(server).post(API_URL).send({ query: activeCart() });
    expect(response).to.have.status(200);
    const cart = getResultFromQuery(response.body, 'activeCart');
    const cartSharedExamples = new CartSharedExamples(cart);
    cartSharedExamples.shouldBehaveLikeCart();
  });

  it('Add product to a cart', async () => {
    const product = (await Factories.factory.create('Product')).toObject();
    let cartItem = buildGraphqlInputFromObject({ productId: product._id.toString() });
    expect(product.in_carts.length).to.eq(0);
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: addCartItemMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    const cartUpdated = getResultFromQuery(updatedCartResponse.body, 'addCartItem');
    const cartUpdatedSharedExamples = new CartSharedExamples(cartUpdated);
    cartUpdatedSharedExamples.shouldBehaveLikeCart();
    expect(cartUpdated.total).to.above(cartBeforeChanges.total);
    expect(cartUpdated.quantity).to.above(cartBeforeChanges.quantity);
    expect(cartUpdated.quantity).to.eq(cartBeforeChanges.quantity + 1);
    expect(cartUpdated.products.length).to.above(cartBeforeChanges.products.length);

    const productFilter = `filters: { idList: ["${product._id.toString()}"] }`;
    const productAfterAddedInCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(productFilter) });
    expect(productAfterAddedInCartResponse).to.have.status(200);
    const productAfterAddedInCart = getResultFromQuery(productAfterAddedInCartResponse.body);
    const productSharedExamples = new ProductsSharedExamples(productAfterAddedInCart);
    productSharedExamples.shouldBehaveLikeProduct();
    productSharedExamples.shouldBehaveLikeProductWithItensInCart();
    expect(productAfterAddedInCart[0].in_carts.length).to.above(0);
  });

  it('Remove product from a cart, it should remove item from product.in_carts, add back product.quantity from product.in_carts and remove it from cart', async () => {
    const response = await chai.request(server).post(API_URL).send({ query: activeCart() });
    expect(response).to.have.status(200);
    const cartBeforeRemoveItem = getResultFromQuery(response.body);
    const productToRemove = cartBeforeRemoveItem.products[0];

    const filterProductInput = `filters: { idList: ["${productToRemove.productId}"] }`;
    const productBeforeCartRemovalResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(filterProductInput) });
    expect(productBeforeCartRemovalResponse).to.have.status(200);
    const productBeforeCartRemoval = getResultFromQuery(productBeforeCartRemovalResponse.body);
    let productSharedExamples = new ProductsSharedExamples(productBeforeCartRemoval);
    productSharedExamples.shouldBehaveLikeProduct();
    expect(productBeforeCartRemoval).to.an('Array');
    expect(productBeforeCartRemoval.length).to.eq(1);
    let removeCartItemInput = buildGraphqlInputFromObject({
      productId: `${productToRemove.productId}`,
    });

    const removeCartItemResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: removeCartItemMutation(removeCartItemInput) });
    expect(response).to.have.status(200);
    const cartUpdated = getResultFromQuery(removeCartItemResponse.body, 'removeCartItem');
    const cartUpdatedSharedExamples = new CartSharedExamples(cartUpdated);
    cartUpdatedSharedExamples.shouldBehaveLikeCart();
    expect(cartUpdated.total).to.below(cartBeforeRemoveItem.total);
    expect(cartUpdated.quantity).to.below(cartBeforeRemoveItem.quantity);
    expect(cartUpdated.products.length).to.below(cartBeforeRemoveItem.products.length);

    const productAfterCartRemovalResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(filterProductInput) });
    expect(productAfterCartRemovalResponse).to.have.status(200);
    const productAfterCartRemoval = getResultFromQuery(productAfterCartRemovalResponse.body);
    productSharedExamples = new ProductsSharedExamples(productAfterCartRemoval);
    productSharedExamples.shouldBehaveLikeProduct();
    expect(productAfterCartRemoval).to.an('Array');
    expect(productAfterCartRemoval.length).to.eq(1);
    expect(productBeforeCartRemoval[0].in_carts.length).to.above(
      productAfterCartRemoval[0].in_carts.length
    );
    expect(productBeforeCartRemoval[0].quantityAvailable).to.below(
      productAfterCartRemoval[0].quantityAvailable
    );
  });

  it('Increment product quantity in a cart when available with limit of quantity', async () => {
    let cartItem = buildGraphqlInputFromObject({
      productId: productFromCart.productId.toString(),
      quantity: 2,
    });
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: updateCartItemQuantityMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    const cartUpdated = getResultFromQuery(updatedCartResponse.body, 'addCartItem');
    const cartUpdatedSharedExamples = new CartSharedExamples(cartUpdated);
    cartUpdatedSharedExamples.shouldBehaveLikeCart();
    expect(cartUpdated.total).to.above(cartBeforeChanges.total);
    expect(cartUpdated.quantity).to.above(cartBeforeChanges.quantity);
    expect(cartUpdated.quantity).to.eq(cartBeforeChanges.quantity + 1);

    const productFilter = `filters: { idList: ["${productFromCart.productId.toString()}"] }`;
    const productAfterAddedInCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(productFilter) });
    expect(productAfterAddedInCartResponse).to.have.status(200);
    const productAfterAddedInCart = getResultFromQuery(productAfterAddedInCartResponse.body);
    const productSharedExamples = new ProductsSharedExamples(productAfterAddedInCart);
    productSharedExamples.shouldBehaveLikeProduct();
    productSharedExamples.shouldBehaveLikeProductWithItensInCart();
    expect(productAfterAddedInCart[0].quantityAvailable).to.below(
      productBeforeChanges[0].quantityAvailable
    );
  });

  it('Increment product quantity in a cart when has more them allowed per customer, should get an error', async () => {
    let cartItem = buildGraphqlInputFromObject({
      productId: productFromCart.productId.toString(),
      quantity: 100,
    });
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: updateCartItemQuantityMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    expect(updatedCartResponse.error).to.exist;
    const graphqlSharedExamples = new GraphqlSharedExamples({
      error: updatedCartResponse.body.errors,
      queryName: 'updateCartItemQuantity',
    });
    graphqlSharedExamples.shouldBehaveLikeGraphqlError();

    const productFilter = `filters: { idList: ["${productFromCart.productId.toString()}"] }`;
    const productAfterAddedInCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(productFilter) });
    expect(productAfterAddedInCartResponse).to.have.status(200);
    const productAfterAddedInCart = getResultFromQuery(productAfterAddedInCartResponse.body);
    const productSharedExamples = new ProductsSharedExamples(productAfterAddedInCart);
    productSharedExamples.shouldBehaveLikeProduct();
    productSharedExamples.shouldBehaveLikeProductWithItensInCart();
    expect(productAfterAddedInCart[0].quantityAvailable).to.eq(
      productBeforeChanges[0].quantityAvailable
    );
    expect(productAfterAddedInCart[0].quantityAvailable).to.eq(
      productBeforeChanges[0].quantityAvailable
    );
  });

  it('Increment invalid product quantity in a cart should return error', async () => {
    let cartItem = buildGraphqlInputFromObject({
      productId: productFromCart.productId.toString(),
      quantity: 9999,
    });
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: updateCartItemQuantityMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    expect(updatedCartResponse.error).to.exist;
    const graphqlSharedExamples = new GraphqlSharedExamples({
      error: updatedCartResponse.body.errors,
      queryName: 'updateCartItemQuantity',
    });
    graphqlSharedExamples.shouldBehaveLikeGraphqlError();

    const productFilter = `filters: { idList: ["${productFromCart.productId.toString()}"] }`;
    const productAfterAddedInCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(productFilter) });
    expect(productAfterAddedInCartResponse).to.have.status(200);
    const productAfterAddedInCart = getResultFromQuery(productAfterAddedInCartResponse.body);
    const productSharedExamples = new ProductsSharedExamples(productAfterAddedInCart);
    productSharedExamples.shouldBehaveLikeProduct();
    productSharedExamples.shouldBehaveLikeProductWithItensInCart();
    expect(productAfterAddedInCart[0].quantityAvailable).to.eq(
      productBeforeChanges[0].quantityAvailable
    );
  });

  it('Increment product quantity in a cart when has more them allowed per customer, should get an error', async () => {
    let cartItem = buildGraphqlInputFromObject({
      productId: productFromCart.productId.toString(),
      quantity: 100,
    });
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: updateCartItemQuantityMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    expect(updatedCartResponse.error).to.exist;
    const graphqlSharedExamples = new GraphqlSharedExamples({
      error: updatedCartResponse.body.errors,
      queryName: 'updateCartItemQuantity',
    });
    graphqlSharedExamples.shouldBehaveLikeGraphqlError();

    const productFilter = `filters: { idList: ["${productFromCart.productId.toString()}"] }`;
    const productAfterAddedInCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: productsFilterQuery(productFilter) });
    expect(productAfterAddedInCartResponse).to.have.status(200);
    const productAfterAddedInCart = getResultFromQuery(productAfterAddedInCartResponse.body);
    const productSharedExamples = new ProductsSharedExamples(productAfterAddedInCart);
    productSharedExamples.shouldBehaveLikeProduct();
    productSharedExamples.shouldBehaveLikeProductWithItensInCart();
    expect(productAfterAddedInCart[0].quantityAvailable).to.eq(
      productBeforeChanges[0].quantityAvailable
    );
    expect(productAfterAddedInCart[0].quantityAvailable).to.eq(
      productBeforeChanges[0].quantityAvailable
    );
  });

  it('Increment invalid product id in a cart when has more them allowed per customer, should get an error', async () => {
    let cartItem = buildGraphqlInputFromObject({
      productId: 'randomProduct',
      quantity: 1,
    });
    cartItem = `cartItem: { ${cartItem} }`;
    const updatedCartResponse = await chai
      .request(server)
      .post(API_URL)
      .send({ query: updateCartItemQuantityMutation(cartItem) });
    expect(updatedCartResponse).to.have.status(200);
    expect(updatedCartResponse.error).to.exist;
    const graphqlSharedExamples = new GraphqlSharedExamples({
      error: updatedCartResponse.body.errors,
      queryName: 'updateCartItemQuantity',
    });
    graphqlSharedExamples.shouldBehaveLikeGraphqlError();
  });

  describe('checkout', () => {
    before(async () => {
      databaseCleaner.clean(database.db);
      const products = await Factories.factory.createMany('Product', 2, {}, { inCart: true });
      await Factories.factory.create('Cart', {}, { attachProduct: products });
    });

    after(async () => {
      databaseCleaner.clean(database.db);
    });

    it('Checkout with not accepted payment', async () => {
      let payment = buildGraphqlInputFromObject({
        paymentCard: 'MASTER_ENUM',
        paymentType: 'CREDIT_CARD_ENUM',
        creditCardNumber: 'XXXX-XXXX-XXXX-9999',
      });
      payment = `payment: { ${payment} }`;
      const checkoutResponse = await chai
        .request(server)
        .post(API_URL)
        .send({ query: checkoutMutation(payment) });
      expect(checkoutResponse).to.have.status(200);
      const checkout = getResultFromQuery(checkoutResponse.body);
      expect(checkout.payment.paymentStatus).to.eq('REFUSED');
    });
  
    it('Checkout with accepted payment', async () => {
      let payment = buildGraphqlInputFromObject({
        paymentCard: 'MASTER_ENUM',
        paymentType: 'CREDIT_CARD_ENUM',
        creditCardNumber: 'XXXX-XXXX-XXXX-8889',
      });
      payment = `payment: { ${payment} }`;
      const checkoutResponse = await chai
        .request(server)
        .post(API_URL)
        .send({ query: checkoutMutation(payment) });
      expect(checkoutResponse).to.have.status(200);
      const checkout = getResultFromQuery(checkoutResponse.body);
      expect(checkout.payment.paymentStatus).to.eq('PAID');
    });
  })
});
