class User {
  constructor() {
    this._clientId = '6099cd86f1dd766242d7ff2b';
  }

  get clientId() {
    return this._clientId;
  }
}

module.exports = new User();