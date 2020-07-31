import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripInfoMainTemplate} from './view/trip-info-main.js';
import {createTripInfoCostTemplate} from './view/trip-info-cost.js';
import {createSwitchMenuTemplate} from './view/switch-menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripDaysTemplate} from './view/trip-days.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {createEventTemplate} from './view/event.js';

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const EVENT_COUNT = 3;

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);

const switchMenuElement = tripMainElement.querySelector(`.trip-controls > h2:first-child`);
const filterElement = tripMainElement.querySelector(`.trip-controls > h2:last-child`);

const softElement = tripEventsElement.querySelector(`:scope > h2:first-child`);

const render = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoTemplate(), PlaceTemplate.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoMainTemplate());
render(tripInfoElement, createTripInfoCostTemplate());

render(switchMenuElement, createSwitchMenuTemplate(), PlaceTemplate.AFTEREND);
render(filterElement, createFilterTemplate(), PlaceTemplate.AFTEREND);
render(softElement, createSortTemplate(), PlaceTemplate.AFTEREND);
render(tripEventsElement, createTripDaysTemplate());

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysElement, createTripDayTemplate());

const tripEventsList = tripDaysElement.querySelector(`.trip-events__list`);

render(tripEventsList, createEditEventTemplate());

for (let i = 1; i < EVENT_COUNT; i++) {
  render(tripEventsList, createEventTemplate());
}
