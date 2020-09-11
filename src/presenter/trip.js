import {PlaceTemplate, SortType, UpdateType, UserAction, FilterType} from '../const';
import {render, remove} from '../utils/render';
import {filter} from '../utils/filter';

import TripInfoView from '../view/trip-info';
import TripInfoMainView from '../view/trip-info-main';
import TripInfoCostView from '../view/trip-info-cost';
import SwitchTripView from '../view/switch-trip';
import SortView from '../view/sort';
import TripDaysView from '../view/trip-days';
import TripDayView from '../view/trip-day';
import NoPointView from '../view/no-point';

import PointPresenter from './point';
import PointNewPresenter from './point-new';

class Trip {
  constructor({containerElement, mainElement, switchMenuElement, sortElement}, pointsModel, filterModel) {
    this._containerElement = containerElement;
    this._mainElement = mainElement;
    this._switchMenuElement = switchMenuElement;
    this._sortElement = sortElement;

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;

    this._pointPresenter = {};
    this._dayComponent = {};

    this._sortComponent = new SortView();

    this._infoComponent = new TripInfoView();
    this._daysComponent = new TripDaysView();

    this._handle = {
      modeChange: this._handleModeChange.bind(this),
      viewAction: this._handleViewAction.bind(this),
      modelEvent: this._handleModelEvent.bind(this),
      sortTypeChange: this._handleSortTypeChange.bind(this)
    };

    this._pointsModel.addObserver(this._handle.modelEvent);
    this._filterModel.addObserver(this._handle.modelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._daysComponent, this._handle.viewAction);
  }

  init() {

    render(this._mainElement, this._infoComponent, PlaceTemplate.AFTERBEGIN);

    render(this._infoComponent, new TripInfoMainView());

    // может нужно TripInfoCostView напрямую с моделью связать? Смутно понимаю как нужно
    render(this._infoComponent, new TripInfoCostView(this._getPoints()));

    render(this._switchMenuElement, new SwitchTripView(), PlaceTemplate.AFTEREND);

    this._renderSort();

    render(this._containerElement, this._daysComponent);

    this._renderPoints();
  }

  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const points = this._pointsModel.getPoints().slice();

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return points.sort(({time: {start: a}}, {time: {start: b}}) => a - b);
      case SortType.TIME:
        return points.sort(({time: timeA}, {time: timeB}) => (timeB.end - timeB.start) - (timeA.end - timeA.start));
      case SortType.PRICE:
        return points.sort(({price: priceA}, {price: priceB}) => priceB - priceA);
      default:
        throw new Error(`Unknown sort type in method _getPoints`);
    }
  }

  _renderSort() {
    remove(this._sortComponent);
    render(this._sortElement, this._sortComponent, PlaceTemplate.AFTEREND);
    this._sortComponent.setSortTypeChangeHandler(this._handle.sortTypeChange);
  }

  _handleSortTypeChange(evt) {
    this._currentSortType = evt.target.value;

    this._clearAllDays();
    this._renderPoints();
  }

  // TODO: забыл, зачем этот метод
  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  /* _handlePointChange(updatedTask) {
    this._points = updateItem(this._points, updatedTask);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedTask);
    this._pointPresenter[updatedTask.id].init(updatedTask);
  } */

  _handleViewAction(actionType, updateType, update) {

    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.FAVORITE:
        this._pointPresenter[data.id].init(data, true);
        break;
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearAllDays();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearAllDays({resetSortType: true});
        this._renderPoints();
        break;
    }
  }

  _clearAllDays({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

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

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
      this._renderSort();
    }
  }

  _renderPoints() {
    const points = this._getPoints();

    if (!points.length) {
      this._renderNoPoint();
      return;
    }

    const filtredPoints = filter[this._filterModel.getFilter()](points);

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        this._renderDefaultSortPoints(filtredPoints);
        break;
      default:
        // т.к. данные уже отсортированы в нужном порядке (по time или price), то нам стоит только их отправить на рендер
        this._renderDay(filtredPoints);
    }
  }

  _renderDefaultSortPoints(points) {
    points.map((point) => {
      // добавим свойство startDay для более удобного деления по дням и отсортируем массив по времени начала
      point.time.startDay = new Date(+point.time.start).setHours(0, 0, 0, 0);
      return point;
    });

    this._dayList = [...new Set(points.map(({time: {startDay}}) => startDay))];

    this._dayList.forEach((day, index) => {
      this._renderDay(points.filter(({time: {startDay}}) => startDay === day), {number: index + 1, date: new Date(day)});
    });
  }

  _renderDay(points, info = {}) {
    const dayComponent = new TripDayView(info);
    this._dayComponent[info.number ? info.number : `0`] = dayComponent;

    const pointListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

    points.forEach((point) => this._renderPoint(pointListElement, point));

    render(this._daysComponent, dayComponent);
  }

  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, this._handle.viewAction, this._handle.modeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoPoint() {
    render(this._containerElement, new NoPointView());
  }
}

export default Trip;
