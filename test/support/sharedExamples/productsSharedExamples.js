/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');

const { expect } = chai;

class ProductSharedExamples {
  constructor(object) {
    this._object = object;
    expect(this._object).to.be.an('Array');
    expect(this._object.length).to.be.above(0);
  }

  get singleProduct() {
    return this._object[0];
  }

  shouldBehaveLikeProductImage() {
    const { images } = this.singleProduct;
    expect(images[0]).to.have.a.property('path');
    expect(images[0]).to.have.a.property('tags');
    expect(images[0]).to.have.a.property('size');
    expect(images[0]).to.have.a.property('type');
  }

  shouldBehaveLikeProductCurrency() {
    expect(this.singleProduct.currency).to.have.a.property('label');
    expect(this.singleProduct.currency).to.have.a.property('name');

  }

  shouldBehaveLikeProduct() {
    expect(this.singleProduct).to.have.a.property('name');
    expect(this.singleProduct).to.have.a.property('quantityAvailable');
    expect(this.singleProduct).to.have.a.property('maxQuantityPerCustomer');
    expect(this.singleProduct).to.have.a.property('category');
    expect(this.singleProduct).to.have.a.property('description');
    expect(this.singleProduct).to.have.a.property('price');
    expect(this.singleProduct).to.have.a.property('images');
    expect(this.singleProduct).to.have.a.property('currency');
    this.shouldBehaveLikeProductImage(this._object);
    this.shouldBehaveLikeProductCurrency(this._object);
  };

  shouldBehaveLikeProductWithItensInCart() {
    expect(this.singleProduct).to.have.a.property('in_carts');
  }
}

module.exports = ProductSharedExamples;