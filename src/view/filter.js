import {createElement, makeForAttribute} from '../utils.js';

const FILTER_LIST = [
  `Everything`,
  `Future`,
  `Past`
];

const createFilterItemTemplate = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input ${isChecked ? `checked` : ``}
      class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
      id="filter-${makeForAttribute(filter)}"
      value="${makeForAttribute(filter)}">
    <label class="trip-filters__filter-label" for="filter-${makeForAttribute(filter)}">${filter}</label>
  </div>`
);


const createFilterTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${FILTER_LIST.map((filter, index)=>createFilterItemTemplate(filter, index === 0)).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filter {
  constructor() {
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
