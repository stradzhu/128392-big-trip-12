import {createElement} from '../utils.js';

const createTripInfoCostTemplate = (points) => {
  const total = points.reduce((sum, {price, waypoint: {offers}}) => (
    sum + price + offers.reduce((sumOffers, {price: priceOffers, isChecked})=>(
      isChecked ? sumOffers + priceOffers : sumOffers), 0)
  ), 0);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

class TripInfoCost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._points);
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

export default TripInfoCost;
