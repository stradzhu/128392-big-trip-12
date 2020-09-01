import AbstractView from './abstract';

const createTripDaysTemplate = () => `<ul class="trip-days"></ul>`;

class TripDays extends AbstractView {
  getTemplate() {
    return createTripDaysTemplate();
  }
}

export default TripDays;
