export { getWeatherInfo, startClock, makeEl };

// ERROR MESSAGE
const errorMsg = document.getElementById("error-msg");
const errorMsgBtn = document.getElementById("error-msg__btn");

// WEATHER DATA SECTION
const footerTime = document.getElementById("time");

/////////////////////
// Time Functions //
///////////////////
let clockInterval;
function updateClock(timezone) {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  footerTime.textContent = time;
}

function startClock(timezone) {
  if (clockInterval) {
    clearInterval(clockInterval);
  }
  updateClock(timezone);

  clockInterval = setInterval(() => {
    updateClock(timezone);
  }, 1000);
}

/////////////////////////
// Making DOM element //
///////////////////////
function makeEl({ elTag, elClass, elText }) {
  const element = document.createElement(elTag);
  if (elClass) element.className = elClass;
  if (elText) element.textContent = elText;
  return element;
}

/////////////////////////////////
// GET WEATHER CLASS AND TEXT //
///////////////////////////////
function getWeatherInfo(code, isDay = true) {
  if ([0].includes(code)) return isDay ? { class: "weather-sun", text: "Clear Sky" } : { class: "weather-moon", text: "Clear Sky" };
  if ([1, 2, 3].includes(code)) return isDay ? { class: "weather-partly-cloudy-sun", text: "Partly Cloudy" } : { class: "weather-partly-cloudy-moon", text: "Partly Cloudy" };
  if ([45, 48].includes(code)) return { class: "weather-fog", text: "Fog" };
  if ([51, 53, 55].includes(code)) return { class: "weather-drizzle", text: "Drizzle" };
  if ([56, 57].includes(code)) return { class: "weather-freezing-drizzle", text: "Freezing Drizzle" };
  if ([61, 63, 65, 66, 67].includes(code)) return { class: "weather-rain", text: "Rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { class: "weather-snow", text: "Snow" };
  if ([80, 81, 82].includes(code)) return { class: "weather-rain-shower", text: "Rain Shower" };
  if ([95].includes(code)) return { class: "weather-thunderstorm", text: "Thunderstorm" };
  if ([96, 99].includes(code)) return { class: "weather-hail", text: "Thunderstorm with hail" };
}
// RETURN OBJECT AND THEN SELECT KEY VALUE PAIR

// Error Message Button Function //
errorMsgBtn.onclick = cancelErrorMsg;
errorMsg.onclick = cancelErrorMsg;
function cancelErrorMsg() {
  errorMsg.className = "hide-error-msg";
}
errorMsg.className = "hide-error-msg";

// Close Error Message with ESC Btn //
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    errorMsg.className = "hide-error-msg";
  }
});
