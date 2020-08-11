import {getRandomInteger} from '../utils.js';
import {TimeInMilliseconds} from '../const.js';

const OFFERS_LIST = [
  {title: `Order Uber`, price: 20},
  {title: `Add luggage`, price: 50},
  {title: `Switch to comfort`, price: 80},
  {title: `Rent a car`, price: 200},
  {title: `Add breakfast`, price: 50},
  {title: `Book tickets`, price: 40},
  {title: `Lunch in city`, price: 30}
];

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
  `Vilnius`,
  `Warsaw`,
  `Zagreb`
];

const TEXT_LIST = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const WAYPOINTS = [
  {
    title: `Taxi`,
    place: `to`,
    icon: `taxi.png`,
    offers: generateOffers()
  },
  {
    title: `Bus`,
    place: `to`,
    icon: `bus.png`,
    offers: generateOffers()
  },
  {
    title: `Train`,
    place: `to`,
    icon: `train.png`,
    offers: generateOffers()
  },
  {
    title: `Ship`,
    place: `to`,
    icon: `ship.png`,
    offers: generateOffers()
  },
  {
    title: `Transport`,
    place: `to`,
    icon: `transport.png`,
    offers: generateOffers()
  },
  {
    title: `Drive`,
    place: `to`,
    icon: `drive.png`,
    offers: generateOffers()
  },
  {
    title: `Flight`,
    place: `to`,
    icon: `flight.png`,
    offers: generateOffers()
  },
  {
    title: `Check-in`,
    place: `in`,
    icon: `check-in.png`,
    offers: generateOffers()
  },
  {
    title: `Sightseeing`,
    place: `in`,
    icon: `sightseeing.png`,
    offers: generateOffers()
  },
  {
    title: `Restaurant`,
    place: `in`,
    icon: `restaurant.png`,
    offers: generateOffers()
  }
];

function generateOffers() {
  let offers = [];
  for (let i = 0, max = getRandomInteger(0, OFFERS_LIST.length - 1); i < max; i++) {
    offers.push(OFFERS_LIST[getRandomInteger(0, OFFERS_LIST.length - 1)]);
  }
  return [...new Set(offers)];
}

const generateDestination = () => {
  let photoList = [];
  for (let i = 1, max = getRandomInteger(1, 10); i <= max; i++) {
    photoList.push(`${getRandomInteger(1, 10)}.jpg`);
  }

  let description = ``;
  for (let i = 1, max = getRandomInteger(1, 5); i <= max; i++) {
    description += description ? ` ` : `` + TEXT_LIST[getRandomInteger(0, TEXT_LIST.length - 1)];
  }

  return {
    title: CITIES[getRandomInteger(0, CITIES.length - 1)],
    photoList,
    description
  };
};

const generatePoint = () => {
  const start = new Date();
  const end = new Date(getRandomInteger(start.getTime() + TimeInMilliseconds.MINUTE, start.getTime() + TimeInMilliseconds.DAY * 2));

  return {
    waypoint: WAYPOINTS[getRandomInteger(0, WAYPOINTS.length - 1)],
    destination: generateDestination(),
    price: getRandomInteger(20, 200),
    time: {
      start,
      end
    }
  };
};

export {generatePoint};
