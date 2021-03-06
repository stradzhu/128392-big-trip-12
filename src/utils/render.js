import {PlaceTemplate} from '../const';
import AbstractView from '../view/abstract';
import moment from 'moment';

const render = (container, child, place = PlaceTemplate.BEFOREEND) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place) {
    case PlaceTemplate.BEFOREBEGIN:
      container.before(child);
      break;
    case PlaceTemplate.AFTERBEGIN:
      container.prepend(child);
      break;
    case PlaceTemplate.BEFOREEND:
      container.append(child);
      break;
    case PlaceTemplate.AFTEREND:
      container.after(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (!parent || !oldChild || !newChild) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (!component) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

const createTwoDigitNumber = (number) => (number < 10 ? `0` : ``) + number;

const createHumanTime = (time) => moment(time).format(`HH:mm`);

const createHumanDate = (time) => moment(time).format(`DD/MM/YY`);

const makeForAttribute = (string) => string.replace(/\s/g, `-`).toLowerCase();

export {render, createElement, replace, remove, createTwoDigitNumber, createHumanTime, createHumanDate, makeForAttribute};
