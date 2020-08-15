import {POINT_COUNT, ESCAPE_KEY_CODE, PlaceTemplate} from './const.js';
import {render, replaceElement} from './utils.js';

import TripInfoView from './view/trip-info.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripInfoCostView from './view/trip-info-cost.js';
import SwitchMenuView from './view/switch-menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import TripDaysView from './view/trip-days.js';
import TripDayView from './view/trip-day.js';
import PointContainerView from './view/point-container.js';
import PointEditView from './view/point-edit.js';
import PointItemView from './view/point-item.js';
import NoPointView from './view/no-point.js';

import {generatePoint} from './mock/point.js';

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const renderPoint = (pointListElement, point) => {
  const pointItemElement = new PointItemView(point).getElement();
  const pointEditElement = new PointEditView(point).getElement();

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      evt.preventDefault();
      replaceElement(pointListElement, pointItemElement, pointEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointItemElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceElement(pointListElement, pointEditElement, pointItemElement);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceElement(pointListElement, pointItemElement, pointEditElement);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceElement(pointListElement, pointItemElement, pointEditElement);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, pointItemElement);
};

const renderBoard = (tripPointsElement, tripPoints) => {

  if (!tripPoints.length) {
    render(tripPointsElement, new NoPointView().getElement());
    return;
  }

  const tripMainElement = document.querySelector(`.trip-main`);
  const switchMenuElement = tripMainElement.querySelector(`.trip-controls > h2:first-child`);
  const filterElement = tripMainElement.querySelector(`.trip-controls > h2:last-child`);

  const sortElement = tripPointsElement.querySelector(`:scope > h2:first-child`);

  const tripInfoElement = new TripInfoView().getElement();

  render(tripMainElement, tripInfoElement, PlaceTemplate.AFTERBEGIN);

  render(tripInfoElement, new TripInfoMainView().getElement());
  render(tripInfoElement, new TripInfoCostView(points).getElement());

  render(switchMenuElement, new SwitchMenuView().getElement(), PlaceTemplate.AFTEREND);
  render(filterElement, new FilterView().getElement(), PlaceTemplate.AFTEREND);
  render(sortElement, new SortView().getElement(), PlaceTemplate.AFTEREND);

  const tripDaysElement = new TripDaysView().getElement();

  render(tripPointsElement, tripDaysElement);

  const tripDayElement = new TripDayView().getElement();

  render(tripDaysElement, tripDayElement);

  const pointContainerElement = new PointContainerView().getElement();

  render(tripDayElement, pointContainerElement);

  for (let i = 0; i < tripPoints.length; i++) {
    renderPoint(pointContainerElement, tripPoints[i]);
  }
};

renderBoard(document.querySelector(`.trip-events`), points);
