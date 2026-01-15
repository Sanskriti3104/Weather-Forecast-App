import "./styles.css";
const API_KEY = process.env.WEATHER_API_KEY;

const searchBtn = document.getElementById("searchBtn");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const condition = document.querySelector(".condition");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const pressure = document.querySelector(".pressure");
const uv = document.querySelector(".uv");

searchBtn.addEventListener("click", getCity);

function getCity(){
    const cityName = document.getElementById("cityName").value.trim();
    fetchWeatherData(cityName);
}

async function fetchWeatherData(cityName) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?&key=${API_KEY}`);
    const data = await response.json();

    console.log(data);
    city.textContent = cityName;
    temp.textContent = data.currentConditions.temp + "°C";
    humidity.textContent = data.currentConditions.humidity + "%";
    wind.textContent = data.currentConditions.windspeed + " km/h";
    pressure.textContent = data.currentConditions.pressure + " mb";
    uv.textContent = data.currentConditions.uvindex;
}
