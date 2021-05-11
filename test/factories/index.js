const { factory } = require('factory-girl');
const MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
const ProductFactory = require('./products/product.factory');

// const Factory = new FactoryGirl.Factory();
factory.setAdapter(MongooseAdapter);

ProductFactory(factory);


module.exports = factory;