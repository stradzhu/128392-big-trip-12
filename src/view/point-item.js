import {TimeInMilliseconds, OFFERS_TYPE_ACTIVITY} from '../const';
import {createTwoDigitNumber, createHumanTime} from '../utils/render';
import {ucFirst} from '../utils/common';
import AbstractView from './abstract';
import he from 'he';

const createOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (`<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(({title, price}, index)=>(
      `${index < 3 ? `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;
        <span class="event__offer-price">${price}</span>
      </li>` : ``}`)).join(``)}
    </ul>`);
};

const createTimeTemplate = ({start, end}) => {
  let timeDiff = end - start;
  let humanTimeDiff = ``;

  const levelConvertDate = Boolean(Math.trunc(timeDiff / TimeInMilliseconds.DAY))
    + Boolean(Math.trunc(timeDiff / TimeInMilliseconds.HOUR)) + 1;

  switch (levelConvertDate) {
    case 3:
      humanTimeDiff = createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.DAY)) + `D `;
      timeDiff = timeDiff % TimeInMilliseconds.DAY;

      humanTimeDiff += createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.HOUR)) + `H `;
      timeDiff = timeDiff % TimeInMilliseconds.HOUR;

      humanTimeDiff += createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.MINUTE)) + `M`;
      break;
    case 2:
      humanTimeDiff += createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.HOUR)) + `H `;
      timeDiff = timeDiff % TimeInMilliseconds.HOUR;

      humanTimeDiff += createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.MINUTE)) + `M`;
      break;
    default:
      humanTimeDiff += createTwoDigitNumber(Math.trunc(timeDiff / TimeInMilliseconds.MINUTE)) + `M`;
  }

  return (
    `<p class="event__time">
      <time class="event__start-time" datetime="${start.toISOString()}">${createHumanTime(start)}</time>
      &mdash;
      <time class="event__end-time" datetime="${end.toISOString()}">${createHumanTime(end)}</time>
    </p>
    <p class="event__duration">${humanTimeDiff}</p>`
  );
};

const createPointItemTemplate = ({type, offers, destination, price, time}) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${ucFirst(type)}">
      </div>
      <h3 class="event__title">${ucFirst(type)} ${OFFERS_TYPE_ACTIVITY.includes(type) ? `in` : `to`} ${destination.name ? he.encode(destination.name) : ``}</h3>

      <div class="event__schedule">
        ${createTimeTemplate(time)}
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${createOffersTemplate(offers)}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

class PointItem extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createPointItemTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}

export default PointItem;
