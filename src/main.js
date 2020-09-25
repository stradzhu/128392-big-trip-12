import {UpdateType} from './const';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import Api from './api';

const AUTHORIZATION = `Basic HTML_Academy_the_best`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const containerElement = document.querySelector(`.trip-events`);
const mainElement = document.querySelector(`.trip-main`);
const switchMenuElement = mainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = mainElement.querySelector(`.trip-controls > h2:last-child`);
const sortElement = containerElement.querySelector(`:scope > h2:first-child`);

const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
  .then(([destinations, offers, points]) => {

    const tripPresenter = new TripPresenter({
      containerElement,
      mainElement,
      switchMenuElement,
      sortElement
    }, pointsModel, filterModel, api, destinations, offers);

    tripPresenter.init();
    filterPresenter.init();

    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tripPresenter.createTask();
    });

    pointsModel.setPoints(UpdateType.INIT, points);

  })
  .catch((err) => {
    pointsModel.setPoints(UpdateType.INIT, []);
    throw err;
  });
