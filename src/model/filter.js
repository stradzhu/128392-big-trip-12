import Observer from '../utils/observer';

class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = null;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default Filter;
