import AbstractView from './abstract';

const createNoTaskTemplate = () => `<p class="trip-events__msg">Loading...</p>`;

class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default Loading;
