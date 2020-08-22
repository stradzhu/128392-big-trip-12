import {PlaceTemplate} from '../const.js';
import AbstractView from '../view/abstract.js';

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

const renderTemplate = (container, template, place = PlaceTemplate.BEFOREEND) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
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

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

const createTwoDigitNumber = (number) => (number < 10 ? `0` : ``) + number;

const createHumanTime = (time) => createTwoDigitNumber(time.getHours()) + `:` + createTwoDigitNumber(time.getMinutes());

const createHumanDate = (time) => createTwoDigitNumber(time.getDate()) + `/` + createTwoDigitNumber(time.getMonth() + 1) + `/` + time.getFullYear().toString().slice(-2);

const makeForAttribute = (string) => string.replace(/\s/g, `-`).toLowerCase();

export {render, renderTemplate, createElement, replace, remove, createTwoDigitNumber, createHumanTime, createHumanDate, makeForAttribute};
