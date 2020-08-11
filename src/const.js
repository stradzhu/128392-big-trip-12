import {getRandomInteger} from "./utils.js";

const POINT_COUNT = getRandomInteger(15, 25);

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const TimeInMilliseconds = {
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000
};

export {POINT_COUNT, PlaceTemplate, TimeInMilliseconds};
