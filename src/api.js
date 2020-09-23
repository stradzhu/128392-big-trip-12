import PointsModel from './model/points';

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._destinations = null;
    this._offers = null;
  }

  getDestinations() {
    if (this._destinations) {
      return Promise.resolve(this._destinations);
    } else {
      return this._load({url: `destinations`})
        .then((destinations) => {
          this._destinations = destinations;
          return destinations;
        });
    }
  }

  getOffers() {
    if (this._offers) {
      return Promise.resolve(this._offers);
    } else {
      return this._load({url: `offers`})
        .then((offers) => {
          this._offers = offers;
          return offers;
        });
    }
  }

  getPoints() {
    return Promise.all([this._load({url: `points`}), this.getOffers()])
      .then(([points, offers]) => {
        return points.map((point) => PointsModel.adaptToClient(point, offers));
      });
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(PointsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .then(Api.toJSON)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < SuccessHTTPStatusRange.MIN && response.status > SuccessHTTPStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export default Api;
