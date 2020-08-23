import AbstractView from './abstract.js';

const NAME_MOUNTHS = {
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

// #10 нужно ли по умолчанию делать делать date = null ? Я как бы его просто не передаю и все
const createTripDayTemplate = ({number = ``, date = null}) => (
  `<li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">${number}</span>
      <time class="day__date" datetime="${date ? date.toISOString() : ``}">
        ${date ? NAME_MOUNTHS[date.getMonth()] + ` ` + date.getDate() : ``}
      </time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

// #11 смешно, я чуть ниже делаю info = {} чтобы выше этому объекту
// присвоить параметры по-умолчанию number и date. Можно как-то в одной строке
class TripDay extends AbstractView {
  constructor(info = {}) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createTripDayTemplate(this._info);
  }
}

export default TripDay;
