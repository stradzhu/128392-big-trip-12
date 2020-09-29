import PointsModel from '../model/points';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
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
    return this._load({url: `points`})
      .then((points) => points.map(PointsModel.adaptToClient));
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

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    });
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
    if (response.headers.get(`Content-Type`).includes(`application/json`)) {
      return response.json();
    }
    return response;
  }

  static catchError(err) {
    throw err;
  }
}

export default Api;
