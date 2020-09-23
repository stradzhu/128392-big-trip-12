import {destinations, WAYPOINTS, KeyCode} from '../const';
import {createHumanTime, createHumanDate, makeForAttribute} from '../utils/render';
import SmartView from './smart';
import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  waypoint: WAYPOINTS[0],
  destination: {},
  price: ``,
  isFavorite: false,
  time: {
    start: new Date(),
    end: new Date()
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
      ${offers.map(({title, price, isChecked}, index) => (`<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" ${isChecked ? `checked` : ``}
            id="event-offer-${makeForAttribute(title)}" data-index-number="${index}" type="checkbox" name="event-offer-${makeForAttribute(title)}">
          <label class="event__offer-label" for="event-offer-${makeForAttribute(title)}">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`)).join(``)}
      </div>
    </section>`);
};

const createPointEditTemplate = ({waypoint, destination, price, isFavorite, time}, isNewPoint = false) => (
  `${!isNewPoint ? `<li class="trip-events__item">`
    : ``}<form class="event event--edit ${isNewPoint ? `trip-events__item` : ``}" action="#" method="post">
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
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" data-value="${destination.title ? he.encode(destination.title) : ``}" value="${destination.title ? he.encode(destination.title) : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map(({title}) => `<option value="${title}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-groupevent__field-group--time">
          <label class="visually-hidden" form="event-start-time-1">
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

        ${!isNewPoint ? `
        <input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button> ` : ``}
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
                ${destination.photoList.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join(``)}
            </div>
          </div> ` : ``}

        </section>` : ``}

      </section>
    </form>
  ${!isNewPoint ? `</li>` : ``}`
);

class PointEdit extends SmartView {
  constructor({point = BLANK_POINT, isNewPoint = false}) {
    super();
    this._data = PointEdit.parsePointToData(point);
    this._isNewPoint = isNewPoint;

    this._datepicker = {
      start: null,
      end: null
    };

    this._handler = {
      timeStartChange: this._timeStartChangeHandler.bind(this),
      timeEndChange: this._timeEndChangeHandler.bind(this),
      typePointClick: this._typePointClickHandler.bind(this),
      priceInputChange: this._priceInputChangeHandler.bind(this),
      priceInputKeydown: this._priceInputKeydownHandler.bind(this),
      offersChange: this._offersChangeHandler, // тут можно без bind
      destinationInputChange: this._destinationInputChangeHandler.bind(this),
      destinationInputInput: this._destinationInputInputHandler.bind(this),
      favoriteClick: this._favoriteClickHandler.bind(this),
      formSubmit: this._formSubmitHandler.bind(this),
      formDeleteClick: this._formDeleteClickHandler.bind(this),
      formClose: this._formCloseHandler.bind(this)
    };

    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerEnd();
    this._offersChangeHandler();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._isNewPoint);
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._datepicker.start) {
      this._datepicker.start.destroy();
      this._datepicker.start = null;
    }

    if (this._datepicker.end) {
      this._datepicker.end.destroy();
      this._datepicker.end = null;
    }
  }

  reset(point) {
    this.updateData(PointEdit.parsePointToData(point));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerEnd();
    this._offersChangeHandler();
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setFormCloseHandler(this._callback.formClose);
  }

  _setDatepickerStart() {
    if (this._datepicker.start) {
      this._datepicker.start.destroy();
      this._datepicker.start = null;
    }

    this._datepicker.start = flatpickr(this.getElement().querySelector(`input[name="event-start-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          time_24hr: true, // eslint-disable-line camelcase
          maxDate: this._data.time.end,
          defaultDate: this._data.time.start,
          onChange: this._handler.timeStartChange
        }
    );
  }

  _setDatepickerEnd() {
    if (this._datepicker.end) {
      this._datepicker.end.destroy();
      this._datepicker.end = null;
    }

    this._datepicker.end = flatpickr(this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          time_24hr: true, // eslint-disable-line camelcase
          minDate: this._data.time.start,
          defaultDate: this._data.time.end,
          onChange: this._handler.timeEndChange
        }
    );
  }

  _timeStartChangeHandler([time]) {
    this.updateData(
        {
          time: {
            start: time,
            end: this._data.time.end
          }
        }, true);
    this._setDatepickerEnd(); // обновим его, т.к. изменилась minDate
  }

  _timeEndChangeHandler([time]) {
    this.updateData(
        {
          time: {
            start: this._data.time.start,
            end: time
          }
        }, true);
    this._setDatepickerStart(); // обновим его, т.к. изменилась maxDate
  }

  _priceInputKeydownHandler(evt) {
    if ([KeyCode.DELETE, KeyCode.BACKSPACE, KeyCode.TAB, KeyCode.ESCAPE, KeyCode.ENTER].includes(evt.keyCode) ||
      (evt.keyCode === KeyCode.A && evt.ctrlKey) ||
      (evt.keyCode === KeyCode.C && evt.ctrlKey) ||
      (evt.keyCode === KeyCode.X && evt.ctrlKey) ||
      (evt.keyCode >= KeyCode.END && evt.keyCode <= KeyCode.RIGHT_ARROW)) {
      return;
    }

    if ((evt.shiftKey || (evt.keyCode < KeyCode[`0`] || evt.keyCode > KeyCode[`9`])) && (evt.keyCode < KeyCode.NUMPAD_0 || evt.keyCode > KeyCode.NUMPAD_9)) {
      evt.preventDefault();
    }
  }

  _priceInputChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: Number(evt.target.value)
    }, true);

    return true;
  }

  _offersChangeHandler() {
    const offersBlock = this.getElement().querySelector(`.event__available-offers`);
    if (!offersBlock) {
      return;
    }

    offersBlock.addEventListener(`change`, (evt) => {
      // очень не уверен, что напрямую менять this._data хорошая идея, ведь мы все остальное пропускаем через this.updateData()
      // но если делать через this.updateData() то возникают проблемы, как точечно передать данные
      const index = evt.target.dataset.indexNumber;
      this._data.waypoint.offers[index].isChecked = evt.target.checked;
    });
  }

  _destinationInputInputHandler(evt) {
    let value = evt.target.value;

    if (value.length === 1) {
      value = value.toUpperCase();
      evt.target.value = value;
    }

    const find = destinations.find(({title}) => title.indexOf(value) === 0);

    if (find) {
      evt.target.dataset.value = evt.target.value;
    } else {
      evt.target.value = evt.target.dataset.value;
    }
  }

  _destinationInputChangeHandler(evt) {
    evt.preventDefault();
    const value = evt.target.value;
    const destination = destinations.find(({title}) => title === value) || {title: value};

    this.updateData({destination});
  }

  _favoriteClickHandler() {
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

    if (!this._data.price || !this._data.destination.title) {
      alert(`Please fill in all required fields! price and description`); // eslint-disable-line no-alert
      return;
    }

    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._handler.typePointClick);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._handler.priceInputChange);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`keydown`, this._handler.priceInputKeydown);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._handler.destinationInputChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._handler.destinationInputInput);
  }

  setFavoriteClickHandler(callback) {
    if (this._isNewPoint) {
      return;
    }
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`input[name="event-favorite"]`).addEventListener(`click`, this._handler.favoriteClick);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    if (this._isNewPoint) {
      this.getElement().addEventListener(`submit`, this._handler.formSubmit);
    } else {
      this.getElement().querySelector(`form`).addEventListener(`submit`, this._handler.formSubmit);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._handler.formDeleteClick);
  }

  setFormCloseHandler(callback) {
    if (this._isNewPoint) {
      return;
    }

    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._handler.formClose);
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {});
  }

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }
}

export default PointEdit;
