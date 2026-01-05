"use strict";

const cityInputLocation = document.querySelector("#cityInput");
const searchButton = document.querySelector(".btn-search");
const cityName = document.querySelector("#current");
const apiKey = "403cb7d562da4bf3b32174009251411";
const day = document.querySelector("#today");

async function getlocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes&lang=en`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    const cityDisplay = document.querySelector("#current .location");
    const dateDisplay = document.querySelector("#today .day");
    const day1 = document.querySelector("#today .date");

    cityDisplay.textContent = data.location.name;
    day1.textContent = getDate(data.location.localtime)
      .split(",")
      .slice(1)
      .join(",")
      .trim();
    dateDisplay.textContent = getDate(data.location.localtime).split(",")[0];
    console.log(cityInputLocation.value);
    getWeather(data);
    getDate(data);
    day2Weather(data);
    day3Weather(data);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message || "Something went wrong!",
    });
  }
}
navigator.geolocation.getCurrentPosition(getlocation, error);
function error(err) {
  Swal.fire({
    icon: "error",
    title: "Geolocation Error",
    text: "Could not get your location. Please allow location access.",
  });
}

async function getWeatherCity() {
  const cityDisplay = document.querySelector("#current .location");
  const dateDisplay = document.querySelector("#today .day");
  const day1 = document.querySelector("#today .date");

  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInputLocation.value}&days=3&aqi=yes&alerts=yes&lang=en`,
    { method: "GET" }
  ).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    return;
  });
  let data = await response.json();

  cityDisplay.textContent = data.location.name;
  day1.textContent = getDate(data.location.localtime)
    .split(",")
    .slice(1)
    .join(",")
    .trim();
  dateDisplay.textContent = getDate(data.location.localtime).split(",")[0];
  getWeather(data);
  day2Weather(data);
  day3Weather(data);
}
searchButton.addEventListener("click", getWeatherCity);

function getDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: "long", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}
function getWeather(data) {
  const temp = document.querySelector("#current .degree .num");
  const imgTemp = document.querySelector("#current .forecast-icon  img");
  const des = document.querySelector("#current .custom");
  const icon1 = document.querySelector("#current .um  h2");
  const icon2 = document.querySelector("#current .wind h2");
  const icon3 = document.querySelector("#current .dir h2");

  temp.innerHTML = `${data.current.temp_c}<sup>o</sup>C`;
  imgTemp.src = data.current.condition.icon;
  des.textContent = data.current.condition.text;

  icon1.innerText = `${data.current.humidity}%`;
  icon2.innerText = `${data.current.wind_kph}km/h`;
  const windMapping = {
    N: "North",
    NNE: "North Northeast",
    NE: "Northeast",
    ENE: "East Northeast",
    E: "East",
    ESE: "East Southeast",
    SE: "Southeast",
    SSE: "South Southeast",
    S: "South",
    SSW: "South Southwest",
    SW: "Southwest",
    WSW: "West Southwest",
    W: "West",
    WNW: "West Northwest",
    NW: "Northwest",
    NNW: "North Northwest",
  };
  icon3.innerText = windMapping[data.current.wind_dir] || data.current.wind_dir;
}
function day2Weather(data) {
  const day2 = document.querySelector("#day2 .day");
  const imgTemp2 = document.querySelector("#day2 .forecast-icon  img");

  const temp2 = document.querySelector("#day2 .degree ");
  const tempC = document.querySelector("#day2 .number");
  const des2 = document.querySelector("#day2 .custom");

  day2.textContent = getDate(data.forecast.forecastday[1].date).split(",")[0];
  imgTemp2.src = data.forecast.forecastday[1].day.condition.icon;
  temp2.innerHTML = `${data.forecast.forecastday[1].day.avgtemp_c}<sup>o</sup>C`;
  tempC.innerHTML = `${data.forecast.forecastday[1].day.mintemp_c}<sup>o</sup>C`;
  des2.textContent = data.forecast.forecastday[1].day.condition.text;
}

function day3Weather(data) {
  const day3 = document.querySelector("#day3 .day");
  const imgTemp3 = document.querySelector("#day3 .forecast-icon  img");

  const temp3 = document.querySelector("#day3 .degree ");
  const tempC3 = document.querySelector("#day3 .number");
  const des3 = document.querySelector("#day3 .custom");

  day3.textContent = getDate(data.forecast.forecastday[2].date).split(",")[0];
  imgTemp3.src = data.forecast.forecastday[2].day.condition.icon;
  temp3.innerHTML = `${data.forecast.forecastday[2].day.avgtemp_c}<sup>o</sup>C`;
  tempC3.innerHTML = `${data.forecast.forecastday[2].day.mintemp_c}<sup>o</sup>C`;
  des3.textContent = data.forecast.forecastday[2].day.condition.text;
}
