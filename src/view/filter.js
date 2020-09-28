import AbstractView from './abstract';

const createFilterItemTemplate = ({type, isChecked, isDisabled}) => (
  `<div class="trip-filters__filter">
    <input ${isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}
      class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
      id="filter-${type}"
      value="${type}">
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`
);

const createFilterTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">
    ${Object.values(filters).map((filter) => createFilterItemTemplate(filter)).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;

    this._handler = {
      filterTypeChange: this._filterTypeChangeHandler.bind(this)
    };
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._handler.filterTypeChange);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}

export default Filter;
