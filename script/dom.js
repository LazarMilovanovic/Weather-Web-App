export {
  heroSection,
  chosenCity,
  cityInput,
  currentCity,
  currentTemp,
  dailyResult,
  weatherData,
  weeklyWeather,
  ctx,
  prevChartBtn,
  nextChartBtn,
  errorMsg,
  errorMsgBtn,
  headerTemp,
  headerApparentTemp,
  minimalTemp,
  precipitationNum,
  weatherIcon,
  maximumTemp,
  humidityNum,
  footerWeatherText,
  footerWindSpeed,
};

// HERO SECTION
const heroSection = document.getElementById("hero");
const chosenCity = document.getElementById("city-input");
const cityInput = document.getElementById("city-input").value.trim();
const currentCity = document.getElementById("current-city");
const currentTemp = document.getElementById("current-temp");
// WEEKLY SECTION
const dailyResult = document.getElementById("daily-report");
const weatherData = document.getElementById("weather-data");
const weeklyWeather = document.getElementById("weekly-report");
// WEEKLY SECTION CHART
const ctx = document.getElementById("chart");
const prevChartBtn = document.getElementById("chart__previous");
const nextChartBtn = document.getElementById("chart__next");
// ERROR MESSAGE
const errorMsg = document.getElementById("error-msg");
const errorMsgBtn = document.getElementById("error-msg__btn");
// WEATHER DATA SECTION
const headerTemp = document.getElementById("temp");
const headerApparentTemp = document.getElementById("apparent-temp");
const minimalTemp = document.getElementById("minimal-temp");
const precipitationNum = document.getElementById("precipitation-num");
const weatherIcon = document.getElementById("weather-icon");
const maximumTemp = document.getElementById("maximum-temp");
const humidityNum = document.getElementById("humidity-num");
const footerWeatherText = document.getElementById("weather-text");
const footerWindSpeed = document.getElementById("wind-speed");
