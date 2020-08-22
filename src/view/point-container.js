import AbstractView from './abstract.js';

const createPointContainerTemplate = () => `<ul class="trip-events__list"></ul>`;

class PointContainer extends AbstractView {
  getTemplate() {
    return createPointContainerTemplate();
  }
}

export default PointContainer;
