import AbstractView from './abstract.js';

const createTripInfoMainTemplate = () => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>`
);

class TripInfoMain extends AbstractView {
  getTemplate() {
    return createTripInfoMainTemplate();
  }
}

export default TripInfoMain;
