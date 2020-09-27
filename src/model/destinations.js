class Destinations {
  constructor() {
    this._destinations = null;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  getInfoByName(name) {
    const info = this._destinations.find((destination) => destination.name === name);
    return info ? info : {};
  }

  getNames() {
    return this._destinations.map((destination) => destination.name).sort();
  }
}

export default Destinations;
