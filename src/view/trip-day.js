import AbstractView from './abstract';

const NAME_MONTHS = {
  0: `JAN`,
  1: `FEB`,
  2: `MAR`,
  3: `APR`,
  4: `MAY`,
  5: `JUNE`,
  6: `JULY`,
  7: `AUG`,
  8: `SEPT`,
  9: `OCT`,
  10: `NOV`,
  11: `DEC`,
};

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
