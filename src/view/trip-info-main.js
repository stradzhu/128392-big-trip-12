import AbstractView from './abstract';
import {NAME_MONTHS} from '../const';

// Если читать ТЗ то там есть фраза "состоит из пунктов назначения (названий городов), разделённых тире",
// которую можно трактовать по разному. Я тебе в телеграмм написал самые нелепые случаи, которые могут произойти
// тут описал по самому простому варианту. И мне нравится эта функция - она простая, логичная и понятная
const createTitle = (point) => {
  switch (point.length) {
    case 1:
      return point[0].destination.title;
    case 2:
      return `${point[0].destination.title} &mdash; ${point[1].destination.title}`;
    case 3:
      return `${point[0].destination.title} &mdash; ${point[1].destination.title} &mdash; ${point[2].destination.title}`;
    default:
      return `${point[0].destination.title} &mdash; ... &mdash; ${point[point.length - 1].destination.title}`;
  }
};

const createDates = (points) => {
  if (points.length === 1) {
    const first = points[0].time.start;
    return `${first.getDate()} ${NAME_MONTHS[first.getMonth()]}`;
  } else {
    const first = points[0].time.start;
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
    // сортируем от меньшего к большего по значению "time start"
    this._points = points.sort(({time: {start: a}}, {time: {start: b}}) => a - b);
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._points);
  }
}

export default TripInfoMain;
