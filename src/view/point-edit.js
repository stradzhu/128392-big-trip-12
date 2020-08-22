import {CITIES, WAYPOINTS} from "../const.js";
import {createHumanTime, createHumanDate, makeForAttribute} from '../utils/render.js';
import AbstractView from './abstract.js';

const createOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offers.map(({title, price, isChecked})=>(`<div class="event__offer-selector">
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

const createPointEditTemplate = ({waypoint, destination, price, time}) => (
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

              ${WAYPOINTS.filter(({place})=>(place === `to`)).map(({title})=>(`
                <div class="event__type-item">
                  <input id="event-type-${title.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${title.toLowerCase()}">
                  <label class="event__type-label event__type-label--${title.toLowerCase()}" for="event-type-${title.toLowerCase()}-1">${title}</label>
                </div>`)).join(``)}

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              ${WAYPOINTS.filter(({place})=>(place === `in`)).map(({title})=>(`
                <div class="event__type-item">
                  <input id="event-type-${title.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${title.toLowerCase()}">
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
            ${CITIES.map((city)=>`<option value="${city}"></option>`).join(``)}
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

        <input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" checked>
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

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination.description}
          </p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
                ${destination.photoList.map((file)=>`<img class="event__photo" src="img/photos/${file}" alt="Event photo">`).join(``)}
            </div>
          </div>
        </section>

      </section>
    </form>
  </li>`
);

class PointEdit extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
  }

  getTemplate() {
    return createPointEditTemplate(this._point);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }
}

export default PointEdit;
