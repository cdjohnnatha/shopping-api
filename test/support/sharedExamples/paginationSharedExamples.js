/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');

const { expect } = chai;

class PaginationSharedExamples {
  constructor(object) {
    this._object = object;
  }

  shouldBehaveLikePaginated() {
    expect(this._object).to.have.a.property('pagination');
    expect(this._object.pagination).to.have.a.property('totalPages');
    expect(this._object.pagination).to.have.a.property('totalValues');
    expect(this._object.pagination).to.have.a.property('rowsPerPage');
    expect(this._object.pagination).to.have.a.property('currentPage');
  };

}

module.exports = PaginationSharedExamples;