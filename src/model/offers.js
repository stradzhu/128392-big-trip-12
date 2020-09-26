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
    // Метод find возращает undefined, если ничего не найдено, а мне удобное получить пустой объект
    // в модели destinations эта проверка явно нужна, а тут больше для подстраховки и единообразия кода
    const info = this._offers.find((offer) => offer.type === type).offers;
    return info ? cloneDeep(info) : {};
  }

  getTypes() {
    return this._offers.map(({type}) => type);
  }
}

export default Offers;
