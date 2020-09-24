import {MenuItem, PlaceTemplate, SortType, UpdateType, UserAction, FilterType} from '../const';
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
import LoadingView from '../view/loading';
import AddPointView from '../view/add-point';
import StatisticsView from '../view/statistics';

import PointPresenter, {State as PointPresenterViewState} from './point';
import PointNewPresenter from './point-new';

class Trip {
  constructor({containerElement, mainElement, switchMenuElement, sortElement}, pointsModel, filterModel, api, destinations, offers) {
    this._containerElement = containerElement;
    this._mainElement = mainElement;
    this._switchMenuElement = switchMenuElement;
    this._sortElement = sortElement;
    this._api = api;
    this._destinations = destinations;
    this._offers = offers;

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;

    this._pointPresenter = {};
    this._dayComponent = {};

    this._isLoading = true;

    this._sortComponent = new SortView();
    this._infoComponent = new TripInfoView();
    this._infoMainComponent = null;
    this._infoCostComponent = null;
    this._switchTripComponent = null;
    this._statisticsComponent = null;
    this._daysComponent = new TripDaysView();
    this._loadingComponent = new LoadingView();

    this._addPointCompnent = new AddPointView(this._mainElement);
    this._addPointCompnent.disabled = false;

    this._handle = {
      modeChange: this._handleModeChange.bind(this),
      viewAction: this._handleViewAction.bind(this),
      modelEvent: this._handleModelEvent.bind(this),
      sortTypeChange: this._handleSortTypeChange.bind(this)
    };

    this._pointNewPresenter = new PointNewPresenter(this._daysComponent, this._handle.viewAction, this._destinations, this._offers);

    render(this._mainElement, this._infoComponent, PlaceTemplate.AFTERBEGIN);

    this._renderInfoMain();
    this._renderInfoCost();

    this._renderSwitchTrip();

    this._pointsModel.addObserver(this._handle.modelEvent);
    this._filterModel.addObserver(this._handle.modelEvent);
  }

  init() {
    render(this._containerElement, this._daysComponent);
    this._renderSort();

    this._renderPoints();
  }

  destroy() {
    this._clearAllDays({resetSortType: true});

    remove(this._daysComponent);
    remove(this._sortComponent);

    // не понимаю, зачем отписываться от модели
    // this._pointsModel.removeObserver(this._handle.modelEvent);
    // this._filterModel.removeObserver(this._handle.modelEvent);
  }

  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getCurrentSortType() {
    return this._currentSortType;
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

  _renderSwitchTrip() {
    this._switchTripComponent = new SwitchTripView();
    render(this._switchMenuElement, this._switchTripComponent, PlaceTemplate.AFTEREND);

    const handleSwitchTripClick = (menuItem) => {
      this._switchTripComponent.setMenuItem(menuItem);
      switch (menuItem) {
        case MenuItem.TABLE:
          this.init();
          remove(this._statisticsComponent);
          break;
        case MenuItem.STATS:
          this.destroy();
          this._statisticsComponent = new StatisticsView(this._pointsModel.getPoints());
          render(this._containerElement, this._statisticsComponent);
          break;
      }
    };

    this._switchTripComponent.setMenuClickHandler(handleSwitchTripClick);
  }

  _renderInfoMain() {
    remove(this._infoMainComponent);
    this._infoMainComponent = new TripInfoMainView(this._getPoints());
    render(this._infoComponent, this._infoMainComponent);
  }

  _renderInfoCost() {
    remove(this._infoCostComponent);
    this._infoCostComponent = new TripInfoCostView(this._getPoints());
    render(this._infoComponent, this._infoCostComponent);
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

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch((err) => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            throw err;
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch((err) => {
            this._pointNewPresenter.setAborting();
            throw err;
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch((err) => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            throw err;
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPoints();
        break;
    }
    this._renderInfoMain();
    this._renderInfoCost();
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
    const pointPresenter = new PointPresenter(
        pointListElement,
        this._handle.viewAction,
        this._handle.modeChange,
        this._getCurrentSortType.bind(this),
        this._destinations,
        this._offers
    );
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoPoint() {
    render(this._containerElement, new NoPointView());
  }

  _renderLoading() {
    render(this._containerElement, this._loadingComponent);
  }
}

export default Trip;
