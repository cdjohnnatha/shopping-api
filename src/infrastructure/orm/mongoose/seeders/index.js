const mongoose = require('../mongoose');
const ProductsSeed = require('./productsSeeder');
const UserSeeder = require('./userSeeder');
const CartSeeder = require('./cartSeeder');

const init = async () => {
    console.log('running seeders');
    console.log('running ProductsSeed');
    await ProductsSeed();
    await UserSeeder();
    await CartSeeder();
    console.log('closing connection');
    mongoose.connection.close()
};

init();