import {CITIES, TimeInMilliseconds, WAYPOINTS, MAX_DAY_GAP} from '../const.js';
import {getRandomInteger} from '../utils.js';

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


const generateDestination = () => {
  let photoList = [];
  for (let i = 1, max = getRandomInteger(1, 10); i <= max; i++) {
    photoList.push(`${getRandomInteger(1, 10)}.jpg`);
  }

  let description = ``;
  for (let i = 1, max = getRandomInteger(1, 5); i <= max; i++) {
    description += (description ? ` ` : ``) + TEXT_LIST[getRandomInteger(0, TEXT_LIST.length - 1)];
  }

  return {
    title: CITIES[getRandomInteger(0, CITIES.length - 1)],
    photoList,
    description
  };
};

const generatePoint = () => {
  const start = new Date(getRandomInteger(Date.now() - MAX_DAY_GAP * TimeInMilliseconds.DAY, Date.now() + MAX_DAY_GAP * TimeInMilliseconds.DAY));
  const end = new Date(getRandomInteger(start.getTime() + TimeInMilliseconds.MINUTE, start.getTime() + TimeInMilliseconds.DAY * 1.2));

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
