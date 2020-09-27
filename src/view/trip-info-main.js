import AbstractView from './abstract';
import {NAME_MONTHS} from '../const';

const Routes = {
  SINGLE: 1,
  DOUBLE: 2,
  TRIPLE: 3
};

const createTitle = (point) => {
  switch (point.length) {
    case Routes.SINGLE:
      return point[0].destination.name;
    case Routes.DOUBLE:
      return `${point[0].destination.name} &mdash; ${point[1].destination.name}`;
    case Routes.TRIPLE:
      return `${point[0].destination.name} &mdash; ${point[1].destination.name} &mdash; ${point[2].destination.name}`;
    default:
      return `${point[0].destination.name} &mdash; ... &mdash; ${point[point.length - 1].destination.name}`;
  }
};

const createDates = (points) => {
  const first = points[0].time.start;
  if (points.length === 1) {
    return `${first.getDate()} ${NAME_MONTHS[first.getMonth()]}`;
  } else {
    const last = points[points.length - 1].time.start;
    return `${first.getDate()} ${NAME_MONTHS[first.getMonth()]} &mdash; ${last.getDate()} ${NAME_MONTHS[last.getMonth()]}`;
  }
};

const createTripInfoMainTemplate = (points) => (
  `<div class="trip-info__main">
    ${points.length ? `
      <h1 class="trip-info__title">${createTitle(points)}</h1>
      <p class="trip-info__dates">${createDates(points)}</p>`
    : ``}
  </div>`
);

class TripInfoMain extends AbstractView {
  constructor(points) {
    super();
    this._points = points.sort(({time: {start: a}}, {time: {start: b}}) => a - b);
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._points);
  }
}

export default TripInfoMain;
