import {getRandomInteger} from "./utils.js";

const POINT_COUNT = getRandomInteger(15, 25);

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export {POINT_COUNT, PlaceTemplate};
