import moment from 'moment';
import {FilterType} from '../const';

const now = new Date();

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(({time: {start}})=> moment(start).isAfter(now)),
  [FilterType.PAST]: (points) => points.filter(({time: {start}})=> moment(start).isBefore(now)),
};

export {filter};
