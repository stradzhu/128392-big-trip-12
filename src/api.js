import PointsModel from './model/points';

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
        .then(Api.toJSON)
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
        .then(Api.toJSON)
        .then((offers) => {
          this._offers = offers;
          return offers;
        });
    }
  }

  getPoints() {
    return Promise.all([this._load({url: `points`}).then(Api.toJSON), this.getOffers()])
      .then(([points, offers]) => {
        return points.map((point) => PointsModel.adaptToClient(point, offers));
      });
  }

  updatePoint(item) {
    return Promise.all([this._load({
      url: `points/${item.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(item)),
      headers: new Headers({"Content-Type": `application/json`})
    }).then(Api.toJSON), this.getOffers()])
      .then(([point, offers]) => PointsModel.adaptToClient(point, offers));
  }

  addPoint(item) {
    return Promise.all([this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(item)),
      headers: new Headers({"Content-Type": `application/json`})
    }).then(Api.toJSON), this.getOffers()])
      .then(([point, offers]) => PointsModel.adaptToClient(point, offers));
  }

  deletePoint(item) {
    return this._load({
      url: `points/${item.id}`,
      method: Method.DELETE
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
