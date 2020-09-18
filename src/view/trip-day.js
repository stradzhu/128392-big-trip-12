import AbstractView from './abstract';
import {NAME_MONTHS} from '../const';

const createTripDayTemplate = ({number = ``, date = null}) => (
  `<li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">${number}</span>
      <time class="day__date" datetime="${date ? date.toISOString() : ``}">
        ${date ? NAME_MONTHS[date.getMonth()] + ` ` + date.getDate() : ``}
      </time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

class TripDay extends AbstractView {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createTripDayTemplate(this._info);
  }
}

export default TripDay;
