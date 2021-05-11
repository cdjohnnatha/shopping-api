const ClientModel = require('../schemas/ClientSchema');

const clientSeeder = async () => {
  const client = {
    _id: '6099cd86f1dd766242d7ff2b',
    firstName: 'Joe',
    lastName: 'Doe',
    birthDate: new Date(),
  };

  return ClientModel.create(client);
}

module.exports = clientSeeder;
