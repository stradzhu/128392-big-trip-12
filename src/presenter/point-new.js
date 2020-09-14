import {nanoid} from 'nanoid';
import PointEditView from '../view/point-edit';
import {remove, render} from '../utils/render';
import {UserAction, UpdateType, PlaceTemplate, ESCAPE_KEY_CODE} from '../const';

class PointNew {
  constructor(listElement, changeData) {
    this._listElement = listElement;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handle = {
      formSubmit: this._handleFormSubmit.bind(this),
      deleteClick: this._handleDeleteClick.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };
  }

  init() {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new PointEditView({isNewPoint: true});
    this._pointEditComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handle.deleteClick);

    render(this._listElement, this._pointEditComponent, PlaceTemplate.BEFOREBEGIN);

    document.addEventListener(`keydown`, this._handle.escKeyDown);
  }

  destroy() {
    // TODO что не попонимаю зачем тут так много кода? Можно просто снять обработчик и все, та и то...
    // ведь нет елемента, нет обработчика
    if (!this._pointEditComponent) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
