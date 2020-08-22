import {POINT_COUNT} from './const.js';

import {generatePoint} from './mock/point.js';

import TripPresenter from './presenter/trip.js';

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const containerElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const switchMenuElement = tripMainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = tripMainElement.querySelector(`.trip-controls > h2:last-child`);
const sortElement = containerElement.querySelector(`:scope > h2:first-child`);

new TripPresenter({
  containerElement,
  tripMainElement,
  switchMenuElement,
  filterElement,
  sortElement
}).init(points);
