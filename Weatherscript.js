const API_KEY = "ef683d5f24bc6bcfb6bf11af324c712d"; // Replace with your WeatherStack API Key

// Fetch weather data by city name
async function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }
    fetchWeatherData(`query=${city}`);
}

// Fetch weather data by user's location
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                const city = await fetchCityFromCoordinates(latitude, longitude);
                if (city) fetchWeatherData(`query=${city}`);
                else alert("Unable to detect location. Please enter a city manually.");
            },
            () => {
                alert("Geolocation access denied. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Fetch data from API
async function fetchWeatherData(query) {
    const url = `https://api.weatherstack.com/current?access_key=${API_KEY}&${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success === false) {
            alert("City not found. Please try again.");
        } else {
            displayWeather(data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data.");
    }
}

// Reverse geocoding to get city name from latitude & longitude
async function fetchCityFromCoordinates(lat, lon) {
    const geoUrl = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || null;
    } catch (error) {
        console.error("Error fetching city from coordinates:", error);
        return null;
    }
}

// Display weather details
function displayWeather(data) {
    document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temperature").innerText = `🌡️ Temperature: ${data.current.temperature}°C`;
    document.getElementById("description").innerText = `🌤️ Condition: ${data.current.weather_descriptions[0]}`;
    document.getElementById("humidity").innerText = `💧 Humidity: ${data.current.humidity}%`;
    document.getElementById("windSpeed").innerText = `💨 Wind Speed: ${data.current.wind_speed} km/h`;

    document.getElementById("weatherInfo").style.display = "block";
}

// Fetch user's location weather on load
window.onload = getLocationWeather;
