const OFFERS_TYPE_ACTIVITY = [`check-in`, `sightseeing`, `restaurant`];

const KeyCode = {
  FIST_GROUP: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    DELETE: 46,
  },
  SECOND_GROUP: {
    A: 65,
    C: 67,
    X: 88
  },
  END: 35,
  RIGHT_ARROW: 39,
  SUB_ZERO: 48,
  SUB_NINE: 57,
  NUM_ZERO: 96,
  NUM_NINE: 105,
};

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

const UpdateType = {
  FAVORITE: `FAVORITE`,
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const TimeInMilliseconds = {
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000
};

const NAME_MONTHS = {
  0: `JAN`,
  1: `FEB`,
  2: `MAR`,
  3: `APR`,
  4: `MAY`,
  5: `JUNE`,
  6: `JULY`,
  7: `AUG`,
  8: `SEPT`,
  9: `OCT`,
  10: `NOV`,
  11: `DEC`,
};

export {OFFERS_TYPE_ACTIVITY, KeyCode, MenuItem, FilterType, SortType, UserAction, UpdateType, PlaceTemplate, TimeInMilliseconds, NAME_MONTHS};
