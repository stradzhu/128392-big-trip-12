import {PlaceTemplate} from './const.js';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const createTwoDigitNumber = (number) => (number < 10 ? `0` : ``) + number;

const createHumanTime = (time) => createTwoDigitNumber(time.getHours()) + `:` + createTwoDigitNumber(time.getMinutes());

const createHumanDate = (time) => createTwoDigitNumber(time.getDate()) + `/` + createTwoDigitNumber(time.getMonth() + 1) + `/` + time.getFullYear().toString().slice(-2);

const render = (container, element, place = PlaceTemplate.BEFOREEND) => {
  switch (place) {
    case PlaceTemplate.BEFOREBEGIN:
      container.before(element);
      break;
    case PlaceTemplate.AFTERBEGIN:
      container.prepend(element);
      break;
    case PlaceTemplate.BEFOREEND:
      container.append(element);
      break;
    case PlaceTemplate.AFTEREND:
      container.after(element);
      break;
  }
};

const renderTemplate = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const replaceElement = (parentNode, newChild, oldChild) => {
  parentNode.replaceChild(newChild, oldChild);
};

export {getRandomInteger, createTwoDigitNumber, createHumanTime, createHumanDate, render, renderTemplate, createElement, replaceElement};
