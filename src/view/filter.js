import {createElement} from '../utils.js';

const createFilterItemTemplate = (filter) => {
  let filterForHTML = filter.replace(/\s/g, `-`).toLowerCase();
  return (
    `<div class="trip-filters__filter">
      <input checked
        class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
        id="filter-${filterForHTML}"
        value="everything" >
      <label class="trip-filters__filter-label" for="filter-${filterForHTML}">${filter}</label>
    </div>`
  );
};

const createFilterTemplate = (filterItems) => (
  `<form class="trip-filters" action="#" method="get">
    ${filterItems.map((filter)=>createFilterItemTemplate(filter)).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filter {
  constructor(filterItems) {
    this._filterItems = filterItems;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filterItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Filter;
