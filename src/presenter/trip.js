import {ESCAPE_KEY_CODE, PlaceTemplate} from '../const.js';
import {render, replace} from '../utils/render.js';

import TripInfoView from '../view/trip-info.js';
import TripInfoMainView from '../view/trip-info-main.js';
import TripInfoCostView from '../view/trip-info-cost.js';
import SwitchTripView from '../view/switch-trip.js';
import FilterView from '../view/filter.js';
import SortView from '../view/sort.js';
import TripDaysView from '../view/trip-days.js';
import TripDayView from '../view/trip-day.js';
import PointItemView from '../view/point-item.js';
import PointEditView from '../view/point-edit.js';
import NoPointView from '../view/no-point.js';

class Trip {
  constructor({containerElement, tripMainElement, switchMenuElement, filterElement, sortElement}) {
    this._containerElement = containerElement;
    this._tripMainElement = tripMainElement;
    this._switchMenuElement = switchMenuElement;
    this._filterElement = filterElement;
    this._sortElement = sortElement;

    this._tripInfoComponent = new TripInfoView();
    this._tripDaysComponent = new TripDaysView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
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

    render(this._tripMainElement, this._tripInfoComponent, PlaceTemplate.AFTERBEGIN);

    render(this._tripInfoComponent, new TripInfoMainView());
    render(this._tripInfoComponent, new TripInfoCostView(points));

    render(this._switchMenuElement, new SwitchTripView(), PlaceTemplate.AFTEREND);
    render(this._filterElement, new FilterView(), PlaceTemplate.AFTEREND);

    this._renderSort();

    render(this._containerElement, this._tripDaysComponent);

    this._dayList.forEach((day, index) => {
      this._renderDay(this._sourcedPoints.filter(({time: {startDay}}) => startDay === day), {number: index + 1, date: new Date(day)});
    });
  }

  _renderSort() {
    const sortComponent = new SortView();
    render(this._sortElement, sortComponent, PlaceTemplate.AFTEREND);
    sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
        this._dayList.forEach((day, index) => {
          this._renderDay(this._sourcedPoints.filter(({time: {startDay}}) => startDay === day), {number: index + 1, date: new Date(day)});
        });
    }
  }

  _clearAllDays() {
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _renderDay(points, info) {
    const tripDayComponent = new TripDayView(info);
    const pointListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);

    for (const point of points) {
      this._renderPoint(pointListElement, point);
    }

    render(this._tripDaysComponent, tripDayComponent);
  }

  _renderPoint(pointListElement, point) {
    const pointItemComponent = new PointItemView(point);
    const pointEditComponent = new PointEditView(point);

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === ESCAPE_KEY_CODE) {
        evt.preventDefault();
        replace(pointItemComponent, pointEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    pointItemComponent.setEditClickHandler(() => {
      replace(pointEditComponent, pointItemComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replace(pointItemComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormCloseHandler(() => {
      replace(pointItemComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(pointListElement, pointItemComponent);
  }

  _renderNoPoint() {
    render(this._containerElement, new NoPointView());
  }
}

export default Trip;
