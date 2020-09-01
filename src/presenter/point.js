import {ESCAPE_KEY_CODE} from '../const.js';
import {render, replace, remove} from '../utils/render.js';
import PointItemView from '../view/point-item.js';
import PointEditView from '../view/point-edit.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Point {
  constructor(listElement, changeData, changeMode) {
    this._listElement = listElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._itemComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handle = {
      editClick: this._handleEditClick.bind(this),
      favoriteClick: this._handleFavoriteClick.bind(this),
      formSubmit: this._handleFormSubmit.bind(this),
      formClose: this._handleFormClose.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };

  }

  init(point) {
    this._point = point;

    const prevItemComponent = this._itemComponent;
    const prevEditComponent = this._editComponent;

    this._itemComponent = new PointItemView(this._point);
    this._editComponent = new PointEditView(this._point);

    this._itemComponent.setEditClickHandler(this._handle.editClick);
    this._editComponent.setFavoriteClickHandler(this._handle.favoriteClick);
    this._editComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._editComponent.setFormCloseHandler(this._handle.formClose);

    if (!prevItemComponent || !prevEditComponent) {
      render(this._listElement, this._itemComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._listElement, prevItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevEditComponent);
    }

    remove(prevItemComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this._itemComponent);
    remove(this._editComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._editComponent, this._itemComponent);
    document.addEventListener(`keydown`, this._handle.escKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._itemComponent, this._editComponent);
    document.removeEventListener(`keydown`, this._handle.escKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToCard();
  }

  _handleFormClose() {
    this._editComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      evt.preventDefault();
      this._handle.formClose();
    }
  }
}

export default Point;
