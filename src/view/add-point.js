class AddPoint {
  constructor(mainElement) {
    this._selector = `.trip-main__event-add-btn`;
    this._mainElement = mainElement;
  }

  set disabled(state) {
    this._getElement().disabled = state;
  }

  _getElement() {
    return this._mainElement.querySelector(this._selector);
  }
}

export default AddPoint;
