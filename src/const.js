import {getRandomInteger} from "./utils/common.js";

const POINT_COUNT = getRandomInteger(15, 25);

const ESCAPE_KEY_CODE = 27;

const CITIES = [
  `Amsterdam`,
  `Budapest`,
  `Copenhagen`,
  `Dublin`,
  `Helsinki`,
  `Kiev`,
  `London`,
  `Moscow`,
  `Oslo`,
  `Paris`,
  `Riga`,
  `Stockholm`,
  `Tallinn`,
  `Vatican`,
  `Warsaw`,
  `Zagreb`
];

const OFFERS_LIST = [
  {title: `Order Uber`, price: 20},
  {title: `Add luggage`, price: 50},
  {title: `Switch to comfort`, price: 80},
  {title: `Rent a car`, price: 200},
  {title: `Add breakfast`, price: 50},
  {title: `Book tickets`, price: 40},
  {title: `Lunch in city`, price: 30},
  {title: `Add meal`, price: 15},
  {title: `Choose seats`, price: 5},
  {title: `Travel by train`, price: 40}
];

const WAYPOINTS = [
  {
    title: `Taxi`,
    place: `to`,
    icon: `taxi.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Bus`,
    place: `to`,
    icon: `bus.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Train`,
    place: `to`,
    icon: `train.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Ship`,
    place: `to`,
    icon: `ship.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Transport`,
    place: `to`,
    icon: `transport.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Drive`,
    place: `to`,
    icon: `drive.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Flight`,
    place: `to`,
    icon: `flight.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Check-in`,
    place: `in`,
    icon: `check-in.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Sightseeing`,
    place: `in`,
    icon: `sightseeing.png`,
    offers: generateUniqueOffers()
  },
  {
    title: `Restaurant`,
    place: `in`,
    icon: `restaurant.png`,
    offers: generateUniqueOffers()
  }
];

const MAX_DAY_GAP = 7;

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

function generateUniqueOffers() {
  let alreadyAdded = [];
  let randomInteger;
  return new Array(getRandomInteger(0, OFFERS_LIST.length)).fill().map(()=>{
    do {
      randomInteger = getRandomInteger(0, OFFERS_LIST.length - 1);
    } while (alreadyAdded.includes(randomInteger));
    alreadyAdded.push(randomInteger);
    return Object.assign({}, OFFERS_LIST[randomInteger], {isChecked: Boolean(getRandomInteger(0, 1))});
  });
}

export {POINT_COUNT, ESCAPE_KEY_CODE, CITIES, WAYPOINTS, MAX_DAY_GAP, PlaceTemplate, TimeInMilliseconds};
