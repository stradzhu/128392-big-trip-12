import {ESCAPE_KEY_CODE} from "../const";
import {render, replace, remove} from "../utils/render";
import PointItemView from "../view/point-item";
import PointEditView from "../view/point-edit";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Point {
  constructor(pointListElement, changeData, changeMode) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointItemComponent = null;
    this._pointEditComponent = null;
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

    const prevPointItemComponent = this._pointItemComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointItemComponent = new PointItemView(this._point);
    this._pointEditComponent = new PointEditView(this._point);

    this._pointItemComponent.setEditClickHandler(this._handle.editClick);
    this._pointEditComponent.setFavoriteClickHandler(this._handle.favoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._pointEditComponent.setFormCloseHandler(this._handle.formClose);

    if (!prevPointItemComponent || !prevPointEditComponent) {
      render(this._pointListElement, this._pointItemComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointListElement, prevPointItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointItemComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointItemComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointItemComponent);
    document.addEventListener(`keydown`, this._handle.escKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointItemComponent, this._pointEditComponent);
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
    this._pointEditComponent.reset(this._point);
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
