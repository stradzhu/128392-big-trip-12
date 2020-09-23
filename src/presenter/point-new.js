import PointEditView from '../view/point-edit';
import {remove, render} from '../utils/render';
import {UserAction, UpdateType, PlaceTemplate, KeyCode} from '../const';

class PointNew {
  constructor(listElement, changeData, destinations, offers) {
    this._listElement = listElement;
    this._changeData = changeData;
    this._destinations = destinations;
    this._offers = offers;

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

    this._pointEditComponent = new PointEditView({
      isNewPoint: true,
      destinations: this._destinations,
      offers: this._offers,
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
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
