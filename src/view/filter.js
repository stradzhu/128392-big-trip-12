import AbstractView from './abstract';

const createFilterItemTemplate = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input ${isChecked ? `checked` : ``}
      class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
      id="filter-${filter}"
      value="${filter}">
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`
);

const createFilterTemplate = (filterType, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${Object.values(filterType).map((filter) => createFilterItemTemplate(filter, filter === currentFilter)).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filter extends AbstractView {
  constructor(filterType, currentFilter) {
    super();
    this._filterType = filterType;
    this._currentFilter = currentFilter;

    this._handler = {
      filterTypeChange: this._filterTypeChangeHandler.bind(this)
    };
  }

  getTemplate() {
    return createFilterTemplate(this._filterType, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._handler.filterTypeChange);
  }
}

export default Filter;
