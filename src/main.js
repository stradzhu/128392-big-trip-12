import {POINT_COUNT} from './const';
import {generatePoint} from './mock/point';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from "./model/filter";

const points = new Array(POINT_COUNT).fill().map(generatePoint).sort(({time: {start: a}}, {time: {start: b}})=> a - b);

const containerElement = document.querySelector(`.trip-events`);
const mainElement = document.querySelector(`.trip-main`);
const switchMenuElement = mainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = mainElement.querySelector(`.trip-controls > h2:last-child`);
const sortElement = containerElement.querySelector(`:scope > h2:first-child`);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  containerElement,
  mainElement,
  switchMenuElement,
  sortElement
}, pointsModel, filterModel);

const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});
