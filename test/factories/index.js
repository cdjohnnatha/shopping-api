const FactoryGirl = require('factory-girl');
const ProductFactory = require('./products/product.factory');
const CartFactory = require('./cart/cart.factory');
const { ClientId } = require('../support/sharedConsts');
class Factory {
  constructor() {
    const factory = FactoryGirl.factory;
    const adapter = new FactoryGirl.MongooseAdapter();
    factory.setAdapter(adapter);
    this._factory = factory;
    ProductFactory(this._factory, ClientId);
    CartFactory(this._factory, ClientId);
  }

  get factory() {
    return this._factory;
  }
}
module.exports = new Factory();