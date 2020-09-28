import FilterView from '../view/filter';
import {render, replace, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {FilterType, PlaceTemplate, UpdateType} from '../const';

class Filter {
  constructor(containerElement, filterModel, pointsModel) {
    this._containerElement = containerElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._handle = {
      modelEvent: this._handleModelEvent.bind(this),
      filterTypeChange: this._handleFilterTypeChange.bind(this),
    };

    this._pointsModel.addObserver(this._handle.modelEvent);
    this._filterModel.addObserver(this._handle.modelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;

    let filters = this._getFilters();
    filters = filters.map(({type, count}) => {
      return {
        type,
        isChecked: count ? type === this._currentFilter : false,
        isDisabled: !count
      };
    });

    this._filterComponent = new FilterView(filters);
    this._filterComponent.setFilterTypeChangeHandler(this._handle.filterTypeChange);

    if (!prevFilterComponent) {
      render(this._containerElement, this._filterComponent, PlaceTemplate.AFTEREND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();
    return Object.values(FilterType).map((type) => ({type, count: filter[type](points).length}));
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}

export default Filter;
