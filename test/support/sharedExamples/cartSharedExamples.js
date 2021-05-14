/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');

const { expect } = chai;

class ProductSharedExamples {
  constructor(object) {
    this._object = object;
  }

  get products() {
    return this._object.products;
  }

  shouldBehaveLikeCartItems() {
    expect(this.products).to.be.an('Array');
    expect(this.products[0]).to.have.a.property('productId');
    expect(this.products[0]).to.have.a.property('quantity');
    expect(this.products[0]).to.have.a.property('price');
  }

  shouldBehaveLikeCart() {
    expect(this._object).to.have.a.property('status');
    expect(this._object).to.have.a.property('quantity');
    expect(this._object).to.have.a.property('total');
    expect(this._object).to.have.a.property('products');
    expect(this._object.products).to.be.an('Array');
    this.shouldBehaveLikeCartItems();
  };
}

module.exports = ProductSharedExamples;