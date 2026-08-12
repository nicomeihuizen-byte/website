// Configuration
const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual free API key

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');

const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

// Event Listeners
searchBtn.addEventListener('click', () => fetchWeather(cityInput.value.trim()));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather(cityInput.value.trim());
});

// Fetch Data from OpenWeatherMap API
async function fetchWeather(city) {
    if (!city) return;

    const url = `https://openweathermap.org{encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError();
    }
}

// Display Data in UI
function displayWeather(data) {
    // Reset visibility
    errorMsg.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    // Populate data
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;

    // Display appropriate weather icon code
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org{iconCode}@2x.png`;
    weatherIcon.classList.remove('hidden');
}

// Handle errors gracefully
function showError() {
    weatherInfo.classList.add('hidden');
    errorMsg.classList.remove('hidden');
}
