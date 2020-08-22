import {ESCAPE_KEY_CODE, PlaceTemplate} from '../const.js';
import {render, replace} from '../utils/render.js';

import TripInfoView from '../view/trip-info.js';
import TripInfoMainView from '../view/trip-info-main.js';
import TripInfoCostView from '../view/trip-info-cost.js';
import SwitchTripView from '../view/switch-trip.js';
import FilterView from '../view/filter.js';
import SortView from '../view/sort.js';
import TripDaysView from '../view/trip-days.js';
import TripDayView from '../view/trip-day.js';
import PointContainerView from '../view/point-container.js';
import PointItemView from '../view/point-item.js';
import PointEditView from '../view/point-edit.js';
import NoPointView from '../view/no-point.js';

class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
  }

  init(tripPoints) {
    if (!tripPoints.length) {
      this._renderNoPoint();
      return;
    }

    this._tripMainElement = document.querySelector(`.trip-main`);
    this._switchMenuElement = this._tripMainElement.querySelector(`.trip-controls > h2:first-child`);
    this._filterElement = this._tripMainElement.querySelector(`.trip-controls > h2:last-child`);
    this._sortElement = this._tripContainer.querySelector(`:scope > h2:first-child`);

    this._tripInfoComponent = new TripInfoView();

    render(this._tripMainElement, this._tripInfoComponent, PlaceTemplate.AFTERBEGIN);

    render(this._tripInfoComponent, new TripInfoMainView());
    render(this._tripInfoComponent, new TripInfoCostView(tripPoints));

    render(this._switchMenuElement, new SwitchTripView(), PlaceTemplate.AFTEREND);
    render(this._filterElement, new FilterView(), PlaceTemplate.AFTEREND);
    render(this._sortElement, new SortView(), PlaceTemplate.AFTEREND);

    this._tripDaysComponent = new TripDaysView();

    render(this._tripContainer, this._tripDaysComponent);

    this._tripDayComponent = new TripDayView();

    render(this._tripDaysComponent, this._tripDayComponent);

    this._pointContainerComponent = new PointContainerView();

    render(this._tripDayComponent, this._pointContainerComponent);

    for (let i = 0; i < tripPoints.length; i++) {
      this._renderPoint(tripPoints[i]);
    }
  }

  _renderPoint(point) {
    const pointItemComponent = new PointItemView(point);
    const pointEditComponent = new PointEditView(point);

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === ESCAPE_KEY_CODE) {
        evt.preventDefault();
        replace(pointItemComponent, pointEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    pointItemComponent.setEditClickHandler(() => {
      replace(pointEditComponent, pointItemComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replace(pointItemComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormCloseHandler(() => {
      replace(pointItemComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._pointContainerComponent, pointItemComponent);
  }

  _renderNoPoint() {
    render(this._tripContainer, new NoPointView());
  }
}

export default Trip;
