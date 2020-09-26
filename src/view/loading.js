import AbstractView from './abstract';

const createNoPointTemplate = () => `<p class="trip-events__msg">Loading...</p>`;

class Loading extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default Loading;
