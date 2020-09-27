import cloneDeep from 'clone-deep';

class Offers {
  constructor() {
    this._offers = null;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  getInfoByType(type) {
    const info = this._offers.find((offer) => offer.type === type).offers;
    return info ? cloneDeep(info) : {};
  }

  getTypes() {
    return this._offers.map(({type}) => type);
  }
}

export default Offers;
