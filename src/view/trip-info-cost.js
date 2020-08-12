export const createTripInfoCostTemplate = (points) => {
  const total = points.reduce((sum, {price, waypoint: {offers}}) => sum + price + offers.reduce((sumOffers, {price: priceOffers})=>sumOffers + priceOffers, 0), 0);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};
