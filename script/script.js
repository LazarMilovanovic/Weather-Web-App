import { getWeatherInfo, startClock, makeEl } from "./functions.js";

// HERO SECTION
const heroSection = document.getElementById("hero");
const chosenCity = document.getElementById("city-input");
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
// const errorMsgBtn = document.getElementById("error-msg__btn");
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

/////////////////////
// Axios Base URL //
///////////////////
const wikiApi = axios.create({
  baseURL: "https://en.wikipedia.org/api/rest_v1/page/summary/",
});

// Start Call Belgrade For Load ///////////////////////
getWeatherForCity(44.804, 20.4651); //44.804, 20.4651
currentCity.textContent = "Belgrade";
wikiApi.get(`Belgrade`).then((response) => (heroSection.style.backgroundImage = `url(${response.data.originalimage.source})`));
// End Call Belgrade For Load/////////////////////////

// Chart JS Variables
let chart;
let currentChartIndex = 0;

///////////////
// Get City //
/////////////
chosenCity.onsearch = searchCity;
async function searchCity() {
  const cityInput = document.getElementById("city-input").value.trim();
  const city = cityInput.replace(/\s+/g, " ");

  if (!city) {
    return;
  }

  try {
    const cityName = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const cityPicture = await wikiApi.get(`${city}`);

    heroSection.style.backgroundImage = `url(${cityPicture.data.originalimage.source})`;
    getWeatherForCity(cityName.data.results[0].latitude, cityName.data.results[0].longitude);

    currentCity.textContent = city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch (err) {
    errorMsg.className = "error-msg";
    chosenCity.value = "";
  }
}

// ////////////////////////////
// Get Weather For The City //
// //////////////////////////
async function getWeatherForCity(latitude, longitude) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code,temperature_2m_min,sunrise,sunset,rain_sum,wind_speed_10m_max&hourly=temperature_2m,weather_code,is_day,precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&forecast_hours=24`,
    );
    console.log(response.data);

    // Response paths //////////////////////////////////////
    const currentInfo = response.data.current;
    const hourlyInfo = response.data.hourly;
    const dailyInfo = response.data.daily;
    const timezone = response.data.timezone;

    ///////////////////////////////////
    // Sunrise And Sunset Variables //
    /////////////////////////////////
    const sunriseTime = new Date(dailyInfo.sunrise[0]).getHours();
    const sunsetTime = new Date(dailyInfo.sunset[0]).getHours();

    // Set Background IS DAY/NIGHT //
    if (currentInfo.is_day) {
      weatherData.classList.remove("night-background");
      weatherData.classList.add("day-background");
    } else {
      weatherData.classList.remove("day-background");
      weatherData.classList.add("night-background");
    }

    //////////////////////////
    // Making daily report //
    ////////////////////////
    dailyResult.textContent = "";
    const hoursInADay = 24;
    for (let i = 0; i < hoursInADay; i++) {
      const timeNum = new Date(hourlyInfo.time[i]).getHours();
      ////////////////////////
      // Make list Element //
      //////////////////////
      const hourlyWeather = makeEl({
        elTag: "li",
      });
      const time = makeEl({
        elTag: "p",
        elClass: "hourly-time",
        elText: hourlyInfo.time[i].split("T")[1],
      });

      const icon = makeEl({
        elTag: "p",
      });
      const weatherCode = hourlyInfo.weather_code[i];

      const getWeatherClass = getWeatherInfo(weatherCode, hourlyInfo.is_day[i]);
      icon.className = getWeatherClass.class;
      const temp = makeEl({ elTag: "p", elClass: "hourly-temp", elText: `${hourlyInfo.temperature_2m[i]}\u00B0` });
      const precipitation = makeEl({ elTag: "p", elClass: "hourly-precipitation", elText: ` ${hourlyInfo.precipitation_probability[i]}%` });
      hourlyWeather.append(time, icon, temp, precipitation);
      dailyResult.append(hourlyWeather);

      //////////////
      // sunrise //
      ////////////
      if (timeNum === sunriseTime) {
        const dailySunrise = makeEl({
          elTag: "li",
        });
        const time = makeEl({ elTag: "p", elClass: "hourly-time", elText: dailyInfo.sunrise[0].split("T")[1] });
        const sunriseIcon = makeEl({
          elTag: "p",
        });
        sunriseIcon.className = "sunrise";
        dailySunrise.append(time, sunriseIcon);
        dailyResult.append(dailySunrise);
      }

      /////////////
      // sunset //
      ///////////
      if (timeNum === sunsetTime) {
        const dailySunset = makeEl({
          elTag: "li",
        });
        const time = makeEl({ elTag: "p", elClass: "hourly-time", elText: dailyInfo.sunset[0].split("T")[1] });
        const sunsetIcon = makeEl({
          elTag: "p",
        });
        sunsetIcon.className = "sunset";
        dailySunset.append(time, sunsetIcon);
        dailyResult.append(dailySunset);
      }
    }

    ///////////////////////////
    // CURRENT WEATHER DATA //
    /////////////////////////
    headerTemp.textContent = currentInfo.temperature_2m;
    headerApparentTemp.textContent = `Feels like ${currentInfo.apparent_temperature}°`;
    minimalTemp.textContent = `${dailyInfo.temperature_2m_min[0]}°`;
    precipitationNum.textContent = currentInfo.precipitation;
    const getWeather = getWeatherInfo(currentInfo.weather_code, currentInfo.is_day);
    weatherIcon.className = getWeather.class;
    maximumTemp.textContent = `${dailyInfo.temperature_2m_max[0]}°`;
    humidityNum.textContent = currentInfo.relative_humidity_2m;
    footerWeatherText.textContent = getWeather.text;
    footerWindSpeed.textContent = `Wind ${currentInfo.wind_speed_10m} km/h`;
    startClock(timezone);

    ///////////////////////////////
    // weekly Report Header Row //
    /////////////////////////////
    weeklyWeather.textContent = "";
    const measuringNames = makeEl({ elTag: "tr", elClass: "header-row" });
    const day = makeEl({ elTag: "th", elClass: "header-day", elText: "Day" });
    const sunrise = makeEl({ elTag: "th", elClass: "sunrise" });
    const sunset = makeEl({ elTag: "th", elClass: "sunset" });
    const minTemp = makeEl({ elTag: "th", elClass: "min-temp" });
    const maxTemp = makeEl({ elTag: "th", elClass: "max-temp" });
    measuringNames.append(day, sunrise, sunset, minTemp, maxTemp);
    weeklyWeather.append(measuringNames);

    // Chart JS Variables//////////////////////////////////////////////
    const daysNames = [];
    const rainChartData = [];
    const minTempChartData = [];
    const maxTempChartData = [];
    const windSpeedChartData = [];

    ////////////////////
    // weekly Report //
    //////////////////
    const daysInAWeek = 7;
    for (let i = 0; i < daysInAWeek; i++) {
      const listEl = makeEl({ elTag: "tr", elClass: "day-element" });
      const dayName = new Date(dailyInfo.time[i]).toLocaleDateString("en-GB", {
        weekday: "short",
      });
      daysNames.push(dayName);
      const day = makeEl({ elTag: "td", elClass: "day-name", elText: dayName });
      const weatherIcon = makeEl({ elTag: "td" });
      const weatherCode = dailyInfo.weather_code[i];
      // Add Var that is up to weatherIcon.className
      // You need to access key=class
      const getWeeklyClass = getWeatherInfo(weatherCode);
      weatherIcon.className = getWeeklyClass.class;

      const sunrise = makeEl({ elTag: "td", elClass: "weather-parameter", elText: dailyInfo.sunrise[i].split("T")[1] });
      const sunset = makeEl({ elTag: "td", elClass: "weather-parameter", elText: dailyInfo.sunset[i].split("T")[1] });
      const minTemp = makeEl({ elTag: "td", elClass: "weather-parameter", elText: `${dailyInfo.temperature_2m_min[i]}°` });
      const maxTemp = makeEl({ elTag: "td", elClass: "weather-parameter", elText: `${dailyInfo.temperature_2m_max[i]}°` });

      listEl.append(day, weatherIcon, sunrise, sunset, minTemp, maxTemp);
      weeklyWeather.append(listEl);

      // Adding Info For Chart Data Variables///////////////////////////////////////
      rainChartData.push(dailyInfo.rain_sum[i]);
      minTempChartData.push(dailyInfo.temperature_2m_min[i]);
      maxTempChartData.push(dailyInfo.temperature_2m_max[i]);
      windSpeedChartData.push(dailyInfo.wind_speed_10m_max[i]);
    }

    Chart.defaults.color = "#ffffff";

    const weatherCharts = [
      {
        title: "Precipitation",
        type: "bar",
        data: {
          labels: daysNames,
          datasets: [
            {
              label: "Rain sum (mm)",
              data: rainChartData,
              backgroundColor: "rgb(58, 209, 55)",
            },
          ],
        },
      },
      {
        title: "Min / Max Temperature",
        type: "line",
        data: {
          labels: daysNames,
          datasets: [
            {
              label: "Max Temperature",
              data: maxTempChartData,
              borderColor: "rgb(245, 59, 59)",
            },
            {
              label: "Min Temperature",
              data: minTempChartData,
              borderColor: "rgb(134, 177, 223)",
            },
          ],
        },
      },
      {
        title: "Wind Speed",
        type: "line",
        data: {
          labels: daysNames,
          datasets: [
            {
              label: "Wind speed km/h",
              data: windSpeedChartData,
              borderColor: "rgb(0, 234, 255)",
            },
          ],
        },
      },
    ];

    function renderChart(index) {
      const config = weatherCharts[index];

      if (!chart) {
        chart = new Chart(ctx, {
          type: config.type,
          data: config.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
        return;
      }

      chart.config.type = config.type;
      chart.data = config.data;

      chart.update();
    }

    renderChart(currentChartIndex);

    prevChartBtn.onclick = prevChart;
    function prevChart() {
      currentChartIndex = (currentChartIndex - 1 + weatherCharts.length) % weatherCharts.length;
      renderChart(currentChartIndex);
    }
    nextChartBtn.onclick = nextChart;
    function nextChart() {
      currentChartIndex = (currentChartIndex + 1) % weatherCharts.length;
      renderChart(currentChartIndex);
    }

    // Adding current temperature to HERO section ////////////////////////////////
    currentTemp.textContent = `${currentInfo.temperature_2m}°C`;
    chosenCity.value = "";
  } catch (error) {
    console.error(error);
  }
}
