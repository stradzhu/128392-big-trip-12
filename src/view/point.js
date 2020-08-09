const createOffersTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (`<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(({title, price}, index)=>(
      `<li class="event__offer" ${index > 2 ? `style="display: none"` : ``}>
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;
        <span class="event__offer-price">${price}</span>
      </li>`)).join(``)}
    </ul>`);
};

const createTimeTemplate = (time) => {
  const {start, end} = time;

  const ONE_MINUTE = 60000;
  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;

  const timeDiff = end - start;
  let humanTimeDiff = ``;
  if (timeDiff < ONE_HOUR) {
    humanTimeDiff = Math.round(timeDiff / ONE_MINUTE) + `M`;
  } else if (timeDiff < ONE_DAY) {
    humanTimeDiff = new Date(timeDiff).toLocaleString(`en-US`, {day: `numeric`, month: `long`});
  } else {
    humanTimeDiff = new Date(timeDiff).toLocaleString(`en-US`, {day: `numeric`, month: `long`});
  }
  return (
    `<p class="event__time">
      <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
      &mdash;
      <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
    </p>
    <p class="event__duration">${humanTimeDiff}</p>`
  );
};

export const createPointTemplate = (point) => {
  const {waypoint, destination, price, time} = point;

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.icon}" alt="${waypoint.title}">
      </div>
      <h3 class="event__title">${waypoint.title} ${waypoint.place} ${destination.title}</h3>

      <div class="event__schedule">
        ${createTimeTemplate(time)}
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${createOffersTemplate(waypoint.offers)}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
