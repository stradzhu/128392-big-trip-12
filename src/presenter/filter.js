import FilterView from '../view/filter';
import {render, replace, remove} from '../utils/render';
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

    this._filterComponent = new FilterView(FilterType, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handle.filterTypeChange);

    if (!prevFilterComponent) {
      render(this._containerElement, this._filterComponent, PlaceTemplate.AFTEREND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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
