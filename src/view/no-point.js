import AbstractView from './abstract';

const createNoPointTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

class NoPoint extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default NoPoint;
