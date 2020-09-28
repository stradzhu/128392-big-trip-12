import AbstractView from './abstract';
import {MenuItem} from '../const';

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createSwitchMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-link="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn" href="#" data-link="${MenuItem.STATS}">${MenuItem.STATS}</a>
  </nav>`
);

class SwitchTrip extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSwitchMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const oldActive = this.getElement().querySelector(`.${ACTIVE_CLASS}[data-link]`);
    if (oldActive !== null) {
      oldActive.classList.remove(ACTIVE_CLASS);
    }

    const currentActive = this.getElement().querySelector(`[data-link="${menuItem}"]`);
    if (currentActive !== null) {
      currentActive.classList.add(ACTIVE_CLASS);
    }
  }

  _menuClickHandler(evt) {
    const target = evt.target;
    const link = target.dataset.link;
    if (!link) {
      return;
    }
    evt.preventDefault();

    if (target.classList.contains(ACTIVE_CLASS)) {
      return;
    }

    this._callback.menuClick(link);
  }
}

export default SwitchTrip;
