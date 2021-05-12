/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');

const { expect } = chai;

class GraphqlSharedExamples {
  constructor({ error, object, queryName, fieldName }) {
    this._object = object;
    this._queryName = queryName;
    this._fieldName = fieldName;
    this._errors = error?.text;
    if (this._errors) {
      this._errors = JSON.parse(this._errors);
    }
  }

  /**
 * @function shouldBehaveLikeGraphqlResponse
 * @description It will verify if has a properly response from graphql.
 * @param {Object} object - Object response data.
 * @param {String} queryName - Query name to get data;
 */
  shouldBehaveLikeGraphqlResponse() {
    expect(this._object).to.have.a.property('data');
    expect(this._object.data).to.have.a.property(this._queryName);
  }

  buildErrors() {
    if (this._errors) {
      this._errors = JSON.parse(this._errors);
      this._errors = this._error?.errors;
    }
  }

  /**
 * @function shouldBehaveLikeGraphqlError
 * @description It will verify the graphql error structure.
 * @param {object} error - Response error object.
 * @param {object} error.text - Response error text.
 */
  shouldBehaveLikeMissingArgumentsGraphqlError() {
    expect(this._errors).to.have.property('errors');
    console.log('[this._errors]', this._errors);
    const [errors] = this._errors.errors;
    expect(errors).to.be.an('Array');
    expect(errors[0]).to.have.property('message');
    expect(errors[0]).to.have.property('locations');
    expect(errors[0].message).to.have.include(this._queryName);
    if (this._fieldName) {
      expect(errors[0].message).to.have.include(this._fieldName);
    }
    expect(errors[0].message).to.have.include('is required');
  };
};





/**
 * @function shouldBehaveLikeGraphqlError
 * @description It will verify the graphql error structure.
 * @param {Object} body - Response body object.
 * @param {String} queryName
 */
const shouldBehaveLikeGraphqlError = (body, queryName) => {
  expect(body).to.have.property('errors');
  expect(body).to.have.property('data');
  const { data } = body;
  let { errors } = body;
  expect(data).to.have.property(queryName);
  expect(errors).to.be.an('Array');
  ([errors] = errors);
  expect(errors).to.have.property('message');
  expect(errors).to.have.property('locations');
  expect(errors).to.have.property('path');
};

/**
 * @function shouldBehaveLikeNotDefinedInputGraphqlError
 * @description It will verify the graphql error structure.
 * @param {Object} body - Response body object.
 * @param {String} queryName
 */
const shouldBehaveLikeNotDefinedInputGraphqlError = (body) => {
  expect(body).to.have.property('errors');
  let { errors } = body;
  expect(errors).to.be.an('Array');
  ([errors] = errors);
  expect(errors).to.have.property('message');
  expect(errors.message).to.includes('is not defined by type');
};

/**
 * @function shouldBehaveLikeNotProvidedRequiredInputGraphqlError
 * @description It will verify the graphql error structure.
 * @param {Object} body - Response body object.
 */
const shouldBehaveLikeNotProvidedRequiredInputGraphqlError = (body) => {
  expect(body).to.have.property('errors');
  let { errors } = body;
  expect(errors).to.be.an('Array');
  ([errors] = errors);
  expect(errors).to.have.property('message');
  expect(errors.message).to.includes('was not provided');
};


module.exports = GraphqlSharedExamples;