import {createElement} from '../utils.js';

const createPointContainerTemplate = () => `<ul class="trip-events__list"></ul>`;

class PointContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPointContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default PointContainer;
