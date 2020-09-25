class AddPoint {
  constructor(mainElement) {
    this._selector = `.trip-main__event-add-btn`;
    this._mainElement = mainElement;
  }

  _getElement() {
    return this._mainElement.querySelector(this._selector);
  }

  set disabled(state) {
    this._getElement().disabled = state;
  }
}

export default AddPoint;
