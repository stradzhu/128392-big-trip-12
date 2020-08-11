const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const createTwoDigitNumber = (number) => (number < 10 ? `0` : ``) + number;

const createHumanTime = (time) => createTwoDigitNumber(time.getHours()) + `:` + createTwoDigitNumber(time.getMinutes());

const createHumanDate = (time) => createTwoDigitNumber(time.getDate()) + `/` + createTwoDigitNumber(time.getMonth() + 1) + `/` + time.getFullYear().toString().slice(-2);

export {getRandomInteger, createTwoDigitNumber, createHumanTime, createHumanDate};
