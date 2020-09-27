import Observer from '../utils/observer';

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

  static adaptToClient(point) {

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          time: {
            start: new Date(point.date_from),
            end: new Date(point.date_to),
            startDay: new Date(point.date_from).setHours(0, 0, 0, 0),
          },
          isFavorite: point.is_favorite,
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

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
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

export default Points;
