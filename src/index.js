import "./styles.css"
const API_KEY = process.env.WEATHER_API_KEY

const searchBtn = document.getElementById("searchBtn");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const condition = document.querySelector(".condition");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const pressure = document.querySelector(".pressure");
const uv = document.querySelector(".uv");
const weeklyForecast = document.querySelector(".weekly-forecast");
const dailyContainer = document.querySelector(".daily");

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
        city.textContent = cityName;
        temp.textContent = data.currentConditions.temp + "°C";
        condition.textContent = data.currentConditions.conditions;
        humidity.textContent = data.currentConditions.humidity + "%";
        wind.textContent = data.currentConditions.windspeed + " km/h";
        pressure.textContent = data.currentConditions.pressure + " hPa";
        uv.textContent = data.currentConditions.uvindex;

        renderWeeklyForecast(data);
    } catch (error) {
        alert("Unable to fetch weather data. Please check the city name.");
        console.error(error);
    }
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
        weeklyForecast.appendChild(dayCard);
    })
}