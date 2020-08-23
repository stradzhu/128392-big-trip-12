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
import PointItemView from '../view/point-item.js';
import PointEditView from '../view/point-edit.js';
import NoPointView from '../view/no-point.js';

class Trip {
  constructor({containerElement, tripMainElement, switchMenuElement, filterElement, sortElement}) {
    this._containerElement = containerElement;
    this._tripMainElement = tripMainElement;
    this._switchMenuElement = switchMenuElement;
    this._filterElement = filterElement;
    this._sortElement = sortElement;

    this._tripInfoComponent = new TripInfoView();
    this._tripDaysComponent = new TripDaysView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    if (!points.length) {
      this._renderNoPoint();
      return;
    }

    // #4. Добавим свойство startDay, чтобы в будущем было удобнее фильтровать массив.
    // Может это плохая идея видоизменять входящие данные? А может startDay из моков пускай приходит?
    // Могу и не добавлять тогда startDay, тогда 2 раза ниже по коду у меня будет более длинная проверка
    this._points = points.map((point) => {
      point.time.startDay = new Date(+point.time.start).setHours(0, 0, 0, 0);
      return point;
    });

    this._sourcedPoints = this._points.slice();

    // получаем список уникальных дней
    this._dayList = [...new Set(this._points.map(({time: {startDay}}) => startDay))];

    render(this._tripMainElement, this._tripInfoComponent, PlaceTemplate.AFTERBEGIN);

    render(this._tripInfoComponent, new TripInfoMainView());
    render(this._tripInfoComponent, new TripInfoCostView(points));

    render(this._switchMenuElement, new SwitchTripView(), PlaceTemplate.AFTEREND);
    render(this._filterElement, new FilterView(), PlaceTemplate.AFTEREND);

    this._renderSort();

    render(this._containerElement, this._tripDaysComponent);

    // #5. Боюсь, не будет ли бага, что какой-то день отрендерится раньше, чем предыдущий?
    // Ведь forEach никого ждать не будет, чуть ниже, решил использовать for of (метод renderDay)
    this._dayList.forEach((day, index) => {
      this._renderDay(this._sourcedPoints.filter(({time: {startDay}}) => startDay === day),
          {number: index + 1, date: new Date(day)});
    });
  }

  _renderSort() {
    const sortComponent = new SortView();
    render(this._sortElement, sortComponent, PlaceTemplate.AFTEREND);
    sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(evt) {
    this._clearAllDays();

    switch (evt.target.value) {
      case `sort-time`:
        // #2. Если строка получается длинной, то может писать фигурные скобки и return?
        this._renderDay(this._points.sort(({time: timeA}, {time: timeB}) => (
          (timeB.end - timeB.start) - (timeA.end - timeA.start)
        )));
        break;
      case `sort-price`:
        this._renderDay(this._points.sort(({price: priceA}, {price: priceB}) => priceB - priceA));
        break;
      default:
        // сюда вошел sort-event (сортировка по-умолчанию)
        // #6. Рендер сортировки по-умолчанию повторяется в коде
        this._dayList.forEach((day, index) => {
          this._renderDay(this._sourcedPoints.filter(({time: {startDay}}) => startDay === day),
              {number: index + 1, date: new Date(day)});
        });
    }
  }

  _clearAllDays() {
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _renderDay(points, info) {
    const tripDayComponent = new TripDayView(info);
    const pointListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);

    // #7. Решил использовать for of и не forEach, т.к. побоялся, что элементы отрендарятся не по порядку.
    // Не совсем понимаю какие функции (операции) синхронные, а какие нет. Может есть справочник какой-то?
    for (const point of points) {
      this._renderPoint(pointListElement, point);
    }

    render(this._tripDaysComponent, tripDayComponent);
  }

  _renderPoint(pointListElement, point) {
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

    render(pointListElement, pointItemComponent);
  }

  _renderNoPoint() {
    render(this._containerElement, new NoPointView());
  }
}

export default Trip;
