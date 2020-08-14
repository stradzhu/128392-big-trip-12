import {POINT_COUNT, PlaceTemplate} from './const.js';
import {render, replaceElement} from './utils.js';

import TripInfoView from './view/trip-info.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripInfoCostView from './view/trip-info-cost.js';
import SwitchMenuView from './view/switch-menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import TripDaysView from './view/trip-days.js';
import TripDayView from './view/trip-day.js';
import PointEditView from './view/point-edit.js';
import PointItemView from './view/point-item.js';

import {generatePoint} from './mock/point.js';
import {generateFilter} from './mock/filter.js';

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const tripMainElement = document.querySelector(`.trip-main`);
const tripPointsElement = document.querySelector(`.trip-events`);

const switchMenuElement = tripMainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = tripMainElement.querySelector(`.trip-controls > h2:last-child`);

const softElement = tripPointsElement.querySelector(`:scope > h2:first-child`);

render(tripMainElement, new TripInfoView().getElement(), PlaceTemplate.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, new TripInfoMainView().getElement());
render(tripInfoElement, new TripInfoCostView(points).getElement());

render(switchMenuElement, new SwitchMenuView().getElement(), PlaceTemplate.AFTEREND);
render(filterElement, new FilterView(generateFilter()).getElement(), PlaceTemplate.AFTEREND);
render(softElement, new SortView().getElement(), PlaceTemplate.AFTEREND);

const tripDaysElement = new TripDaysView().getElement();

render(tripPointsElement, tripDaysElement);

render(tripDaysElement, new TripDayView().getElement());

const tripPointsList = tripDaysElement.querySelector(`.trip-events__list`);

render(tripPointsList, new PointEditView(points[0]).getElement());

for (let i = 1; i < points.length; i++) {
  render(tripPointsList, new PointItemView(points[i]).getElement());
}
