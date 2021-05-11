/**
 * @CleanEntityDB
 * @function Generic function used to delete entities.
 * @param {Object} model - Model which is gonna be use to delete something.
 * @param {Object} where - Constraints to delete an entity.
 */
const CleanEntityDB = async (model, where) => {
  try {
    return await model.destroy({ where });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  CleanEntityDB,
};
