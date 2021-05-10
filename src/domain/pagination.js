class Pagination {
    constructor({ currentPage = 0, rowsPerPage = 10, totalValues = 0 }) {
        this._currentPage = currentPage;
        this._rowsPerPage = rowsPerPage;
        this._totalValues = totalValues;
    }

    get pagination() {
      return {
        currentPage: this._currentPage,
        rowsPerPage: this._rowsPerPage,
        totalValues: this._totalValues,
      };
    }

    get skipOffset() {
        return (this._currentPage - 1) * this._rowsPerPage + 1;
    }

    get totalPages() {
        return Math.ceil(this._totalValues / this._rowsPerPage);
    }

    set totalValues(totalValues) {
      this._totalValues = totalValues;
    }

    get responsePagination() {
      const pagination = this.pagination;
      pagination.totalPages = this.totalPages;

      return pagination;
    }
}

module.exports = Pagination;