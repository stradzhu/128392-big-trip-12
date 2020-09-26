import {UpdateType} from './const';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = `Basic HTML_Academy_the_best`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME_POINTS = `${STORE_PREFIX}-points-${STORE_VER}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-offers-${STORE_VER}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-destinations-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const storePoints = new Store(STORE_NAME_POINTS, window.localStorage);
const storeOffers = new Store(STORE_NAME_OFFERS, window.localStorage);
const storeDestinations = new Store(STORE_NAME_DESTINATIONS, window.localStorage);

const apiWithProvider = new Provider(api, storePoints, storeOffers, storeDestinations);

const models = {
  points: new PointsModel(),
  filter: new FilterModel(),
  offers: new OffersModel(),
  destinations: new DestinationsModel()
};

const containerElement = document.querySelector(`.trip-events`);
const mainElement = document.querySelector(`.trip-main`);
const switchMenuElement = mainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = mainElement.querySelector(`.trip-controls > h2:last-child`);
const sortElement = containerElement.querySelector(`:scope > h2:first-child`);

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getOffers(), apiWithProvider.getPoints()])
  .then(([destinations, offers, points]) => {

    const tripPresenter = new TripPresenter({
      containerElement,
      mainElement,
      switchMenuElement,
      sortElement
    }, models, apiWithProvider);

    const filterPresenter = new FilterPresenter(filterElement, models.filter, models.points);

    tripPresenter.init();
    filterPresenter.init();

    models.offers.setOffers(offers);
    models.destinations.setDestinations(destinations);
    models.points.setPoints(UpdateType.INIT, points);

    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tripPresenter.createPoint();
    });
  })
  .catch((err) => {
    throw err;
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    })
    .catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
