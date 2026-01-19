import "./styles.css";
import humidityIcon from "./assets/air/humidity.svg";
import pressureIcon from "./assets/air/gauge.svg";
import windIcon from "./assets/air/wind.svg";
import uvIcon from "./assets/air/sun.svg";

const API_KEY = process.env.WEATHER_API_KEY

const searchBtn = document.getElementById("searchBtn");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const condition = document.querySelector(".condition");
const weatherIcon = document.querySelector(".weather-display-icon");
const humidity = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-value");
const pressure = document.querySelector(".pressure-value");
const uv = document.querySelector(".uv-value");
const todayForecast = document.querySelector(".today-forecast");
const hoursContainer = document.querySelector(".hours");
const weeklyForecast = document.querySelector(".weekly-forecast");
const dailyContainer = document.querySelector(".daily");

document.getElementById("humidityIcon").src = humidityIcon;
document.getElementById("pressureIcon").src = pressureIcon;
document.getElementById("windIcon").src = windIcon;
document.getElementById("uvIcon").src = uvIcon;

searchBtn.addEventListener("click", getCity);

function getCity() {
    const cityName = document.getElementById("cityName").value.trim();
    if (!cityName) {
        alert("Please enter a city name");
        return;
    }
    fetchWeatherData(cityName);
}

async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?&key=${API_KEY}`);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();

        console.log(data);
        updateWeatherDisplay(data);
        renderWeeklyForecast(data);
        renderHourlyForecast(data);
    } catch (error) {
        alert("Unable to fetch weather data. Please check the city name.");
        console.error(error);
    }
}

function updateWeatherDisplay(data) {
    city.textContent = data.resolvedAddress;
    temp.textContent = data.currentConditions.temp;
    condition.textContent = data.currentConditions.conditions;
    humidity.textContent = data.currentConditions.humidity + "%";
    wind.textContent = data.currentConditions.windspeed + " km/h";
    pressure.textContent = data.currentConditions.pressure + " hPa";
    uv.textContent = data.currentConditions.uvindex;

    const weatherIcon = document.querySelector(".weather-display-icon img");
    weatherIcon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${data.currentConditions.icon}.png`;
    weatherIcon.alt = data.currentConditions.conditions;
}

function renderHourlyForecast(data) {
    hoursContainer.innerHTML = "";

    const now = new Date();

    const upcomingHours = data.days[0].hours.filter(hour => hour.datetimeEpoch * 1000 > now.getTime()).slice(0, 7);
    upcomingHours.forEach(hour => {
        const hourCard = document.createElement("div");
        hourCard.classList.add("hour-card");

        const hourObj = new Date(hour.datetimeEpoch * 1000);
        const time = hourObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const temp = Math.round(hour.temp);
        const condition = hour.conditions;
        const icon = hour.icon;

        const hourCardIcon = document.createElement("img");
        hourCardIcon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${icon}.png`;
        hourCardIcon.alt = condition;
        hourCardIcon.classList.add("hour-icon");

        const hourCardContent = document.createElement("div");
        hourCardContent.classList.add("hour-content");
        hourCardContent.innerHTML = `
            <div class="hour-temp">${temp}°F</div>
            <div class="hour-time">${time}</div>
        `;

        hourCard.appendChild(hourCardIcon);
        hourCard.appendChild(hourCardContent);
        hoursContainer.appendChild(hourCard);
    });
}

function renderWeeklyForecast(data) {
    dailyContainer.innerHTML = "";

    data.days.slice(0, 7).forEach(day => {
        const dayCard = document.createElement("div");
        dayCard.className = "day-card";

        const dateObj = new Date(day.datetime);
        const date = dateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });

        const temp = Math.round(day.temp);
        const condition = day.conditions;
        const icon = day.icon;

        const dayCardIcon = document.createElement("img");
        dayCardIcon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${icon}.png`;
        dayCardIcon.alt = condition;
        dayCardIcon.classList.add("day-icon");

        dayCard.appendChild(dayCardIcon);

        const dayCardContent = document.createElement("div");
        dayCardContent.classList.add("day-content");
        dayCardContent.innerHTML = `
            <div class="day-temp">${temp}°F</div>
            <div class="day-date">${date}</div>
            <div class="day-condition">${condition}</div>
        `;
        dayCard.appendChild(dayCardContent);
        dailyContainer.appendChild(dayCard);
    })
}