import cloneDeep from 'clone-deep';
import Observer from '../utils/observer';
import {OFFERS_TYPE_WHERE_PLACE_IN} from '../const';

class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point, offers) {
    // узнаем все доступные доп.предложения для нашего point.type
    let avalibleOffers = cloneDeep(offers.find(({type}) => type === point.type)[`offers`]);

    // подмешаем в этот массив объектов новое свойство isChecked (сравниваем по title)
    avalibleOffers = avalibleOffers.map((offer) => {
      offer.isChecked = !!point.offers.find(({title}) => title === offer.title);
      return offer;
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          // поле id сошлось с севером
          // поле destination сошлось с севером
          price: point.base_price,
          time: {
            start: new Date(point.date_from),
            end: new Date(point.date_to),
            // добавим свойство startDay для более удобного деления точек по дням
            startDay: new Date(point.date_from).setHours(0, 0, 0, 0),
          },
          isFavorite: point.is_favorite,
          waypoint: {
            title: point.type.charAt(0).toUpperCase() + point.type.slice(1),
            icon: `${point.type}.png`,
            type: point.type,
            place: OFFERS_TYPE_WHERE_PLACE_IN.includes(point.type) ? `in` : `to`,
            offers: avalibleOffers
          }
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.type;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          'base_price': point.price,
          'date_from': point.time.start.toISOString(),
          'date_to': point.time.end.toISOString(),
          'is_favorite': point.isFavorite,
          'type': point.waypoint.type,
          // с offers сначала удалим неотмеченные, а затем удалим сам ключ isChecked
          'offers': point.waypoint.offers.filter(({isChecked}) => isChecked).map((offer) => {
            delete offer.isChecked;
            return offer;
          })
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.waypoint;

    return adaptedPoint;
  }
}

export default Points;
