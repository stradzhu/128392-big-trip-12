import {PlaceTemplate} from '../const';
import {render, remove} from '../utils/render';
import {updateItem} from '../utils/common';

import TripInfoView from '../view/trip-info';
import TripInfoMainView from '../view/trip-info-main';
import TripInfoCostView from '../view/trip-info-cost';
import SwitchTripView from '../view/switch-trip';
import FilterView from '../view/filter';
import SortView from '../view/sort';
import TripDaysView from '../view/trip-days';
import TripDayView from '../view/trip-day';
import NoPointView from '../view/no-point';

import PointPresenter from './point';

class Trip {
  constructor({containerElement, mainElement, switchMenuElement, filterElement, sortElement}) {
    this._containerElement = containerElement;
    this._mainElement = mainElement;
    this._switchMenuElement = switchMenuElement;
    this._filterElement = filterElement;
    this._sortElement = sortElement;

    this._pointPresenter = {};
    this._dayComponent = {};

    this._infoComponent = new TripInfoView();
    this._daysComponent = new TripDaysView();

    this._handle = {
      modeChange: this._handleModeChange.bind(this),
      pointChange: this._handlePointChange.bind(this),
      sortTypeChange: this._handleSortTypeChange.bind(this)
    };
  }

  init(points) {
    if (!points.length) {
      this._renderNoPoint();
      return;
    }

    this._points = points.map((point) => {
      point.time.startDay = new Date(+point.time.start).setHours(0, 0, 0, 0);
      return point;
    });

    this._sourcedPoints = this._points.slice();

    this._dayList = [...new Set(this._points.map(({time: {startDay}}) => startDay))];

    render(this._mainElement, this._infoComponent, PlaceTemplate.AFTERBEGIN);

    render(this._infoComponent, new TripInfoMainView());
    render(this._infoComponent, new TripInfoCostView(points));

    render(this._switchMenuElement, new SwitchTripView(), PlaceTemplate.AFTEREND);
    render(this._filterElement, new FilterView(), PlaceTemplate.AFTEREND);

    this._renderSort();

    render(this._containerElement, this._daysComponent);

    this._renderDefaultSortTasks();
  }

  _renderSort() {
    const sortComponent = new SortView();
    render(this._sortElement, sortComponent, PlaceTemplate.AFTEREND);
    sortComponent.setSortTypeChangeHandler(this._handle.sortTypeChange);
  }

  _handleSortTypeChange(evt) {
    this._clearAllDays();

    switch (evt.target.value) {
      case `sort-time`:
        this._renderDay(this._points.sort(({time: timeA}, {time: timeB}) => (timeB.end - timeB.start) - (timeA.end - timeA.start)));
        break;
      case `sort-price`:
        this._renderDay(this._points.sort(({price: priceA}, {price: priceB}) => priceB - priceA));
        break;
      default:
        this._renderDefaultSortTasks();
    }
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedTask) {
    this._points = updateItem(this._points, updatedTask);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedTask);
    this._pointPresenter[updatedTask.id].init(updatedTask);
  }

  _renderDefaultSortTasks() {
    this._dayList.forEach((day, index) => {
      this._renderDay(this._sourcedPoints.filter(({time: {startDay}}) => startDay === day), {number: index + 1, date: new Date(day)});
    });
  }

  _clearAllDays() {
    // очищаем все point (они хранятся внутри дней)
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    // очищаем список дней
    Object
      .values(this._dayComponent)
      .forEach((component) => remove(component));
    this._dayComponent = {};
  }

  _renderDay(points, info = {}) {
    const dayComponent = new TripDayView(info);
    this._dayComponent[info.number ? info.number : `0`] = dayComponent;

    const pointListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

    points.forEach((point) => this._renderPoint(pointListElement, point));

    render(this._daysComponent, dayComponent);
  }

  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, this._handle.pointChange, this._handle.modeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoPoint() {
    render(this._containerElement, new NoPointView());
  }
}

export default Trip;
