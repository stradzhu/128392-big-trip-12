import {destinations, WAYPOINTS} from '../const.js';
import {createHumanTime, createHumanDate, makeForAttribute} from '../utils/render.js';
import SmartView from './smart.js';
import {nanoid} from 'nanoid';

// TODO: продумать, как должен выглядеть BLANK_POINT
const BLANK_POINT = {
  id: nanoid(),
  waypoint: null,
  destination: null,
  price: null,
  isFavorite: false,
  time: {
    start: null,
    end: null
  }
};

const createOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offers.map(({title, price, isChecked}) => (`<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" ${isChecked ? `checked` : ``}
            id="event-offer-${makeForAttribute(title)}" type="checkbox" name="event-offer-${makeForAttribute(title)}">
          <label class="event__offer-label" for="event-offer-${makeForAttribute(title)}">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`)).join(``)}
      </div>
    </section>`);
};

const createPointEditTemplate = ({waypoint, destination, price, isFavorite, time}) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.icon}" alt="${waypoint.title}">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${WAYPOINTS.filter(({place}) => (place === `to`)).map(({title}) => (`
                <div class="event__type-item">
                  <input id="event-type-${title.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio"
                      name="event-type" value="${title.toLowerCase()}" ${waypoint.title === title ? `checked` : ``}>
                  <label class="event__type-label event__type-label--${title.toLowerCase()}" for="event-type-${title.toLowerCase()}-1">${title}</label>
                </div>`)).join(``)}

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              ${WAYPOINTS.filter(({place}) => (place === `in`)).map(({title}) => (`
                <div class="event__type-item">
                  <input id="event-type-${title.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio"
                      name="event-type" value="${title.toLowerCase()}" ${waypoint.title === title ? `checked` : ``}>
                  <label class="event__type-label event__type-label--${title.toLowerCase()}" for="event-type-${title.toLowerCase()}-1">${title}</label>
                </div>`)).join(``)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${waypoint.title} ${waypoint.place}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.title}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map(({title}) => `<option value="${title}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-groupevent__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${createHumanDate(time.start)} ${createHumanTime(time.start)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${createHumanDate(time.end)} ${createHumanTime(time.end)}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">

        ${createOffersTemplate(waypoint.offers)}

        ${destination.description || destination.photoList ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>

          ${destination.description ? `
          <p class="event__destination-description">
            ${destination.description}
          </p> ` : ``}

          ${destination.photoList ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
                ${destination.photoList.map((file) => `<img class="event__photo" src="img/photos/${file}" alt="Event photo">`).join(``)}
            </div>
          </div> ` : ``}

        </section>` : ``}

      </section>
    </form>
  </li>`
);

class PointEdit extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = PointEdit.parsePointToData(point);

    this._handler = {
      favoriteClick: this._favoriteClickHandler.bind(this),
      typePointClick: this._typePointClickHandler.bind(this),
      priceInput: this._priceInputHandler.bind(this),
      destinationInput: this._destinationInputHandler.bind(this),
      formSubmit: this._formSubmitHandler.bind(this),
      formClose: this._formCloseHandler.bind(this)
    };

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  reset(task) {
    this.updateData(PointEdit.parsePointToData(task));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: evt.target.value
    }, true);

    return true;
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const value = evt.target.value;
    const destination = destinations.find(({title}) => title === value) || {title: value};

    this.updateData({destination});
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _typePointClickHandler(evt) {
    const target = evt.target;
    if (target.name !== `event-type`) {
      return;
    }

    if (this._data.waypoint.title.toLowerCase() === target.value) {
      // Закрытие всплывайки нужно только, если пользователь кликнет на тот же тип маршрута, что уже выбран.
      // иначе, при клике на другой тип маршрута, вся карточка будет обновлена и закрывать всплывайку смысла нету
      this.getElement().querySelector(`#event-type-toggle-1`).checked = false;
      return;
    }

    this.updateData({waypoint: WAYPOINTS.find(({title}) => title.toLowerCase() === target.value)});
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._handler.typePointClick);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._handler.priceInput);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._handler.destinationInput);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`input[name="event-favorite"]`).addEventListener(`change`, this._handler.favoriteClick);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._handler.formSubmit);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._handler.formClose);
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {});
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}

export default PointEdit;
