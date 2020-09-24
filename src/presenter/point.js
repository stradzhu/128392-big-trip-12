import moment from 'moment';
import {KeyCode, UserAction, UpdateType, SortType} from '../const';
import {render, replace, remove} from '../utils/render';
import PointItemView from '../view/point-item';
import PointEditView from '../view/point-edit';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

class Point {
  constructor(listElement, changeData, changeMode, getSortType, destinations, offers) {
    this._listElement = listElement;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._getSortType = getSortType;
    this._destinations = destinations;
    this._offers = offers;

    this._itemComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handle = {
      editClick: this._handleEditClick.bind(this),
      favoriteClick: this._handleFavoriteClick.bind(this),
      formSubmit: this._handleFormSubmit.bind(this),
      deleteClick: this._handleDeleteClick.bind(this),
      formClose: this._handleFormClose.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };
  }

  init(point, updateFavorite) {
    this._point = point;

    const prevItemComponent = this._itemComponent;
    const prevEditComponent = this._editComponent;

    this._itemComponent = new PointItemView(this._point);
    this._editComponent = new PointEditView({
      point: this._point,
      destinations: this._destinations, // destinations и offers нужны внутри
      offers: this._offers,
    });

    this._itemComponent.setEditClickHandler(this._handle.editClick);
    this._editComponent.setFavoriteClickHandler(this._handle.favoriteClick);
    this._editComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._editComponent.setDeleteClickHandler(this._handle.deleteClick);
    this._editComponent.setFormCloseHandler(this._handle.formClose);

    if (!prevItemComponent || !prevEditComponent) {
      render(this._listElement, this._itemComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._itemComponent, prevItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      // чтобы клик по "избранное" не закрывал форму
      if (updateFavorite) {
        replace(this._editComponent, prevEditComponent);
      } else {
        replace(this._itemComponent, prevEditComponent);
        this._mode = Mode.DEFAULT;
      }
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

  setViewState(state) {
    const resetFormState = () => {
      this._editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._itemComponent.shake(resetFormState);
        this._editComponent.shake(resetFormState);
        break;
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
        UserAction.UPDATE_POINT,
        UpdateType.FAVORITE,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }

  _handleFormSubmit(point) {
    // чтобы понять, какой тип обновления нам нужен PATCH или MINOR нам нужно понять,
    // что конкретно изменилось, а также какой сейчас тип сортировки.
    // Например, изменение цены - может быть PATCH если стоит сортировка EVENT или TIME и
    // оно будет MINOR если поинты сортируются по цене
    // this._point - старые данные
    // point - новые данные
    // this._getSortType - текущий метод сортировки
    let updateType = UpdateType.PATCH;

    switch (this._getSortType()) {
      case SortType.DEFAULT:
        if (!moment(point.time.start).isSame(this._point.time.start)) {
          updateType = UpdateType.MINOR;
        }
        break;
      case SortType.TIME:
        const diffOld = this._point.time.end.getTime() - this._point.time.start.getTime();
        const diffNew = point.time.end.getTime() - point.time.start.getTime();
        if (diffOld !== diffNew) {
          updateType = UpdateType.MINOR;
        }
        break;
      case SortType.PRICE:
        if (point.price !== this._point.price) {
          updateType = UpdateType.MINOR;
        }
        break;
      default:
        throw new Error(`Unknown SortType in method _handleFormSubmit`);
    }

    this._changeData(
        UserAction.UPDATE_POINT,
        updateType,
        point
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFormClose() {
    this._editComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      this._handle.formClose();
    }
  }
}

export default Point;
