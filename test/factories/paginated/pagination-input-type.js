const paginationInputType = (page=0, rowsPerPage=10) => `
  pagination{
    currentPage: ${page},
    rowsPerPage: ${rowsPerPage}
  }
`;

module.exports = {
  paginationInputType,
};