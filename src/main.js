import {POINT_COUNT, PlaceTemplate} from "./const.js";

import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripInfoMainTemplate} from './view/trip-info-main.js';
import {createTripInfoCostTemplate} from './view/trip-info-cost.js';
import {createSwitchMenuTemplate} from './view/switch-menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripDaysTemplate} from './view/trip-days.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createPointTemplate} from './view/point.js';

import {generatePoint} from "./mock/point.js";

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const tripMainElement = document.querySelector(`.trip-main`);
const tripPointsElement = document.querySelector(`.trip-events`);

const switchMenuElement = tripMainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = tripMainElement.querySelector(`.trip-controls > h2:last-child`);

const softElement = tripPointsElement.querySelector(`:scope > h2:first-child`);

const render = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoTemplate(), PlaceTemplate.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoMainTemplate());
render(tripInfoElement, createTripInfoCostTemplate());

render(switchMenuElement, createSwitchMenuTemplate(), PlaceTemplate.AFTEREND);
render(filterElement, createFilterTemplate(), PlaceTemplate.AFTEREND);
render(softElement, createSortTemplate(), PlaceTemplate.AFTEREND);
render(tripPointsElement, createTripDaysTemplate());

const tripDaysElement = tripPointsElement.querySelector(`.trip-days`);

render(tripDaysElement, createTripDayTemplate());

const tripPointsList = tripDaysElement.querySelector(`.trip-events__list`);

render(tripPointsList, createPointEditTemplate(points[0]));

for (let i = 1; i < points.length; i++) {
  render(tripPointsList, createPointTemplate(points[i]));
}
