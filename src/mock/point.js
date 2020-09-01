import {TimeInMilliseconds, WAYPOINTS, MAX_DAY_GAP, destinations} from '../const.js';
import {getRandomInteger} from '../utils/common.js';
import {nanoid} from 'nanoid';

const generatePoint = () => {
  const start = new Date(getRandomInteger(Date.now() - MAX_DAY_GAP * TimeInMilliseconds.DAY, Date.now() + MAX_DAY_GAP * TimeInMilliseconds.DAY));
  const end = new Date(getRandomInteger(start.getTime() + TimeInMilliseconds.MINUTE, start.getTime() + TimeInMilliseconds.DAY * 1.2));
  const waypoint = Object.assign({}, WAYPOINTS[getRandomInteger(0, WAYPOINTS.length - 1)]);

  waypoint.offers = waypoint.offers.map((way) => {
    return Object.assign({}, way, {isChecked: Boolean(getRandomInteger(0, 1))});
  });

  return {
    id: nanoid(),
    waypoint,
    destination: destinations[getRandomInteger(0, destinations.length - 1)],
    price: getRandomInteger(20, 200),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    time: {
      start,
      end
    }
  };
};

export {generatePoint};
