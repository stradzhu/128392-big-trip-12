import AbstractView from './abstract';

const createTripInfoCostTemplate = (points) => {
  const total = points.reduce((sum, {price, waypoint: {offers}}) => (
    sum + price + offers.reduce((sumOffers, {price: priceOffers, isChecked})=>(
      isChecked ? sumOffers + priceOffers : sumOffers), 0)
  ), 0);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

class TripInfoCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._points);
  }
}

export default TripInfoCost;
