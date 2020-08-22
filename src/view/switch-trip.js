import AbstractView from './abstract.js';

const createSwitchMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
);

class SwitchTrip extends AbstractView {
  getTemplate() {
    return createSwitchMenuTemplate();
  }
}

export default SwitchTrip;
