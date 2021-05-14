const _ = require('lodash');
/**
 * @function mutationString
 * @description It will help to create a mutation structure from graphql.
 * @param {String} actionName - Action mutation name.
 * @param {Object} inputs - Input if has some.
 * @param {Object} output - Selected fields to show from graphql
 */
const mutationString = (actionName, inputs, output) => {
  if (output) {
    return (`
      mutation {
        ${actionName}(${inputs}){
          ${output}
        }
      }
    `);
  }
  return (`mutation { ${actionName}(${inputs}) }`);
};

/**
 * @function queryString
 * @description It will help to create a query structure from graphql.
 * @param {String} actionName - Action query name.
 * @param {Object} inputs - Input if has some.
 * @param {Object} output - Selected fields to show from graphql
 */
const queryString = (actionName, inputs, output) => {
  let query = null;
  if (inputs && output) {
    query = (`query { ${actionName}(${inputs}){ ${output} } }`);
  } else if (!inputs && output) {
    query = (`query { ${actionName}{ ${output} } }`);
  } else if (inputs && !output) {
    query = (`query { ${actionName}(${inputs}) } `);
  } else {
    query = (`query { ${actionName} }`);
  }

  return query;
};

/**
 * @function getResultFromQuery
 * @description it will help to extract the real information from result.
 * @param {Object} body - Response body
 * @param {Object} body.data - Response body with graphql Result.
 * @param {String} queryName - Query name.
 */
const getResultFromQuery = ({ data }) => {
  const [queryName] = Object.keys(data);
  return data[queryName];
}

const buildGraphqlInputFromObject = (object) => {
  let input = '';
  _.each(object, (value, key) => {
    if (typeof value === 'string') {
      if (value.includes('_ENUM')) {
        value = value.replace('_ENUM', '');
      } else value = `"${value}"`;
    }
    if (input.length !== 0) input = `${input}, ${key}: ${value}`;
    else input = `${key}: ${value}`;
  });

  return input;
};

const buildMultipleInputObjects = (object) => {
  let output = '';
  let key = null;
  object.forEach((element, index) => {
    ([key] = Object.keys(element));
    if (index + 1 !== object.length) {
      output = `${output} ${key}: { ${element[key]} },`;
    } else output = `${output} ${key}: { ${element[key]} }`;
  });

  return output;
};

const createEnumType = (element) => {
  const [name] = Object.keys(element);
  return `${name}: ${element}`;
};

module.exports = {
  mutationString,
  queryString,
  getResultFromQuery,
  buildGraphqlInputFromObject,
  buildMultipleInputObjects,
  createEnumType,
};