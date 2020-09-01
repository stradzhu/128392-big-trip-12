import {POINT_COUNT} from './const';
import {generatePoint} from './mock/point';
import TripPresenter from './presenter/trip';

const points = new Array(POINT_COUNT).fill().map(generatePoint).sort(({time: {start: a}}, {time: {start: b}})=> a - b);

const containerElement = document.querySelector(`.trip-events`);
const mainElement = document.querySelector(`.trip-main`);
const switchMenuElement = mainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = mainElement.querySelector(`.trip-controls > h2:last-child`);
const sortElement = containerElement.querySelector(`:scope > h2:first-child`);

new TripPresenter({
  containerElement,
  mainElement,
  switchMenuElement,
  filterElement,
  sortElement
}).init(points);
