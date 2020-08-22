import {POINT_COUNT} from './const.js';

import {generatePoint} from './mock/point.js';

import TripPresenter from './presenter/trip.js';

const points = new Array(POINT_COUNT).fill().map(generatePoint);

new TripPresenter(document.querySelector(`.trip-events`)).init(points);
