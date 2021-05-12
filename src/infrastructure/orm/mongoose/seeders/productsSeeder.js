const { commerce, datatype } = require('faker');
const mongoose = require('../mongoose');
const ProductRepository = require('../../../repositories/productRepositoryMongo');

const GUITAR_IMAGES_FOLDER = ['floyd-1', 'floyd-2', 'flyInV', 'lespaul'];
const STATIC_IMAGES_PATH = '/images/guitarImages';


const Product = () => {
  const imageIndex = datatype.number(3);
  return {
    name: commerce.productName(),
    quantityAvailable: datatype.number(30),
    maxQuantityPerCustomer: 3,
    category: commerce.department(),
    price: commerce.price(100, 5000),
    description: commerce.productDescription(),
    currency: {
      label: 'R$',
      name: 'BRL'
    },
    images: [
      {
        path: `${STATIC_IMAGES_PATH}/${GUITAR_IMAGES_FOLDER[imageIndex]}/1200x395.jpg`,
        tags: 'les-paul',
        size: '1200x450',
        type: 'full',
      },
      {
        path: `${STATIC_IMAGES_PATH}/${GUITAR_IMAGES_FOLDER[imageIndex]}/320x120.jpg`,
        tags: 'les-paul',
        size: '320x120',
        type: 'list',
      },
      {
        path: `${STATIC_IMAGES_PATH}/${GUITAR_IMAGES_FOLDER[imageIndex]}/180x68.jpg`,
        tags: 'les-paul',
        size: '180x68',
        type: 'thumbnail',
      },
    ]
  }
};

const productsSeed = async (totalItems = 100) => {
  const products = [];
  console.log('running');
  for (let index = 0; index < totalItems; index++) {
    products.push(Product());
  }
  console.log('running', products);
  const productsRepository = new ProductRepository();
  return productsRepository.bulkCreate(products);
};

module.exports = productsSeed
