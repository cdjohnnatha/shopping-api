/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const { commerce, datatype } = require('faker');

const ProductSchema = require('../../../src/infrastructure/orm/mongoose/schemas/Products');

const GUITAR_IMAGES_FOLDER_NAMES = ['floyd-1', 'floyd-2', 'flyInV', 'lespaul'];
const STATIC_IMAGES_PATH = '/images/guitarImages';

const ProductFactory = factory => factory.define('Product', ProductSchema, (_buildOptions) => {
  const imageIndex = datatype.number(3);
  const guitarImageFolderName = GUITAR_IMAGES_FOLDER_NAMES[imageIndex];
  const guitarImageFolderPath = `${STATIC_IMAGES_PATH}/${guitarImageFolderName}/`;

  let attrs = {
    name: commerce.productName(),
    quantityAvailable: datatype.number(30),
    category: commerce.department(),
    price: commerce.price(100, 5000),
    description: commerce.productDescription(),
    currency: {
      label: 'R$',
      name: 'BRL'
    },
    images: [
      {
        path: `${guitarImageFolderPath}/1200x395.jpg`,
        tags: 'les-paul',
        size: '1200x450',
        type: 'FULL',
      },
      {
        path: `${guitarImageFolderPath}/320x120.jpg`,
        tags: 'les-paul',
        size: '320x120',
        type: 'LIST',
      },
      {
        path: `${guitarImageFolderPath}/180x68.jpg`,
        tags: 'les-paul',
        size: '180x68',
        type: 'THUMBNAIL',
      },
    ]
  };



  return attrs;
});

module.exports = ProductFactory;