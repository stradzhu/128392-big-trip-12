import PointEditView from '../view/point-edit';
import {remove, render} from '../utils/render';
import {UserAction, UpdateType, PlaceTemplate, KeyCode} from '../const';

class PointNew {
  constructor(listElement, changeData, models) {
    this._listElement = listElement;
    this._changeData = changeData;
    this._models = models;

    this._pointEditComponent = null;

    this._handle = {
      formSubmit: this._handleFormSubmit.bind(this),
      deleteClick: this._handleDeleteClick.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };
  }

  init(callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    this._pointEditComponent = new PointEditView({
      isNewPoint: true,
      models: this._models
    });
    this._pointEditComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handle.deleteClick);

    render(this._listElement, this._pointEditComponent, PlaceTemplate.BEFOREBEGIN);

    document.addEventListener(`keydown`, this._handle.escKeyDown);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  destroy() {
    if (!this._pointEditComponent) {
      return;
    }

    if (this._destroyCallback) {
      this._destroyCallback();
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === KeyCode.FIST_GROUP.ESCAPE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
