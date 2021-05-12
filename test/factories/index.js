const FactoryGirl = require('factory-girl');
const ProductFactory = require('./products/product.factory');

class Factory {
  constructor() {
    this._factory = FactoryGirl.factory;
    this._adapter = new FactoryGirl.MongooseAdapter();
    this._factory.setAdapter(this._adapter);
    ProductFactory(this._factory);
  }

  get factory() {
    return this._factory;
  }
}
module.exports = new Factory();