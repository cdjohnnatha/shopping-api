const mongoose = require('../mongoose');
const ProductsSeed = require('./productsSeeder');

const init = async () => {
    console.log('running seeders');
    console.log('running ProductsSeed');
    await ProductsSeed();
    console.log('closing connection');
    mongoose.connection.close()
};

init();