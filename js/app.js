// Configuration
const CONFIG = {
    API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY', // Replace with your API key from openweathermap.org
    BASE_URL: 'https://api.openweathermap.org',
    UNITS: 'metric', // metric for Celsius, imperial for Fahrenheit
    FAVORITES_KEY: 'weatherFavorites'
};

// State
let currentWeatherData = null;
let currentLocation = { lat: null, lon: null, name: '' };
let favorites = JSON.parse(localStorage.getItem(CONFIG.FAVORITES_KEY)) || [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const hourlyForecast = document.getElementById('hourlyForecast');
const fiveDayForecast = document.getElementById('fiveDayForecast');
const detailsContainer = document.getElementById('detailsContainer');
const favoritesList = document.getElementById('favoritesList');
const suggestionsDiv = document.getElementById('suggestions');
const errorToast = document.getElementById('errorToast');
const successToast = document.getElementById('successToast');

// Event Listeners
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

searchInput.addEventListener('input', handleSearchInput);
searchBtn.addEventListener('click', searchWeather);
locationBtn.addEventListener('click', getCurrentLocation);

// Debounce for search input
let searchTimeout;
function handleSearchInput(e) {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
    }

    searchTimeout = setTimeout(() => {
        fetchCitySuggestions(query);
    }, 300);
}

// Fetch city suggestions
async function fetchCitySuggestions(query) {
    try {
        const response = await fetch(
            `${CONFIG.BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${CONFIG.API_KEY}`
        );
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function displaySuggestions(cities) {
    if (cities.length === 0) {
        suggestionsDiv.classList.remove('active');
        return;
    }

    suggestionsDiv.innerHTML = cities.map(city => `
        <div class="suggestion-item" onclick="selectSuggestion('${city.lat}', '${city.lon}', '${city.name}', '${city.country}')">
            <strong>${city.name}</strong>, ${city.country}
        </div>
    `).join('');
    
    suggestionsDiv.classList.add('active');
}

function selectSuggestion(lat, lon, name, country) {
    currentLocation = { lat, lon, name: `${name}, ${country}` };
    searchInput.value = currentLocation.name;
    suggestionsDiv.classList.remove('active');
    fetchWeatherData(lat, lon);
}

// Search weather
function searchWeather() {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a city name');
        return;
    }

    // Use the geocoding API to get coordinates
    fetch(`${CONFIG.BASE_URL}/geo/1.0/direct?q=${query}&limit=1&appid=${CONFIG.API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                showError('City not found. Please try again.');
                return;
            }
            const { lat, lon, name, country } = data[0];
            currentLocation = { lat, lon, name: `${name}, ${country}` };
            searchInput.value = currentLocation.name;
            fetchWeatherData(lat, lon);
        })
        .catch(error => {
            showError('Error searching for city');
            console.error('Error:', error);
        });
}

// Get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported by your browser');
        return;
    }

    locationBtn.disabled = true;
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
        },
        (error) => {
            showError('Unable to get your location');
            console.error('Geolocation error:', error);
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
        }
    );
}

// Fetch weather data
async function fetchWeatherData(lat, lon) {
    try {
        currentWeatherContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading weather data...</div>';
        hourlyForecast.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading forecast...</div>';
        fiveDayForecast.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading forecast...</div>';

        const [currentData, forecastData] = await Promise.all([
            fetch(`${CONFIG.BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`).then(r => r.json()),
            fetch(`${CONFIG.BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`).then(r => r.json())
        ]);

        if (currentData.cod !== 200) {
            throw new Error('Failed to fetch weather data');
        }

        currentWeatherData = currentData;
        displayCurrentWeather(currentData);
        displayHourlyForecast(forecastData);
        displayFiveDayForecast(forecastData);
        updateDetails(currentData);
        updateFavoritesDisplay();
    } catch (error) {
        showError('Error fetching weather data. Please check your API key.');
        console.error('Error:', error);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const { name, sys, main, weather, wind, clouds } = data;
    const isFavorite = favorites.some(fav => fav.lat == data.coord.lat && fav.lon == data.coord.lon);
    
    const weatherIcon = getWeatherIcon(weather[0].main);
    const html = `
        <div class="current-weather-content">
            <div class="weather-left">
                <div class="location-name">${name}, ${sys.country}</div>
                <div class="weather-description">${weather[0].description}</div>
                <div class="temperature-display">${Math.round(main.temp)}°${CONFIG.UNITS === 'metric' ? 'C' : 'F'}</div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${data.coord.lat}', '${data.coord.lon}', '${name}', '${sys.country}', '${weather[0].main}')">
                    <i class="fas fa-heart"></i> ${isFavorite ? 'Remove' : 'Save'}
                </button>
            </div>
            <div class="weather-right">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-meta">
                    <div class="meta-item">
                        <span>Max Temp</span>
                        <span>${Math.round(main.temp_max)}°</span>
                    </div>
                    <div class="meta-item">
                        <span>Min Temp</span>
                        <span>${Math.round(main.temp_min)}°</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    currentWeatherContainer.innerHTML = html;
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyData = data.list.slice(0, 8); // Next 24 hours (8 * 3-hour intervals)
    const html = hourlyData.map(hour => {
        const date = new Date(hour.dt * 1000);
        const time = date.getHours() + ':00';
        const temp = Math.round(hour.main.temp);
        const icon = getWeatherIcon(hour.weather[0].main);
        const rainChance = hour.pop ? Math.round(hour.pop * 100) : 0;
        
        return `
            <div class="hourly-card">
                <div class="hourly-time">${time}</div>
                <div>${icon}</div>
                <div class="hourly-temp">${temp}°</div>
                <div class="hourly-rain">${rainChance}% 🌧️</div>
            </div>
        `;
    }).join('');
    
    hourlyForecast.innerHTML = html;
}

// Display 5-day forecast
function displayFiveDayForecast(data) {
    const dailyData = {};
    
    data.list.forEach(hour => {
        const date = new Date(hour.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(hour);
    });

    const forecastDays = Object.keys(dailyData).slice(0, 5);
    const html = forecastDays.map(date => {
        const dayData = dailyData[date];
        const temps = dayData.map(d => d.main.temp);
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const mainWeather = dayData[Math.floor(dayData.length / 2)].weather[0].main;
        const icon = getWeatherIcon(mainWeather);
        const dayName = new Date(dayData[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        
        return `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div>${icon}</div>
                <div class="forecast-temps">
                    <span>${Math.round(maxTemp)}°</span>
                    <span>${Math.round(minTemp)}°</span>
                </div>
                <div class="forecast-description">${mainWeather.toLowerCase()}</div>
            </div>
        `;
    }).join('');
    
    fiveDayForecast.innerHTML = html;
}

// Update additional details
function updateDetails(data) {
    const { main, wind, sys, visibility, clouds } = data;
    const uvIndex = getUVIndex(main.temp);
    
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${main.pressure} mb`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('uvIndex').textContent = uvIndex;
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°`;
}

// Toggle favorite
function toggleFavorite(lat, lon, name, country, weather) {
    const index = favorites.findIndex(fav => fav.lat == lat && fav.lon == lon);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showSuccess('Location removed from favorites');
    } else {
        favorites.push({ lat, lon, name, country, weather });
        showSuccess('Location added to favorites');
    }
    
    localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoritesDisplay();
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
    }
}

// Update favorites display
function updateFavoritesDisplay() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No saved locations yet</p>';
        return;
    }

    const html = favorites.map((fav, index) => `
        <div class="favorite-item" onclick="selectFavorite(${index})">
            <div class="favorite-name">${fav.name}</div>
            <div class="favorite-temp">--°</div>
            <button class="favorite-remove" onclick="removeFavorite(event, ${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    favoritesList.innerHTML = html;
}

function selectFavorite(index) {
    const fav = favorites[index];
    fetchWeatherData(fav.lat, fav.lon);
}

function removeFavorite(e, index) {
    e.stopPropagation();
    favorites.splice(index, 1);
    localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoritesDisplay();
    showSuccess('Favorite removed');
}

// Utility functions
function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '💨',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return iconMap[weatherMain] || '🌤️';
}

function getUVIndex(temp) {
    // Simple estimation based on temperature
    if (temp > 30) return 'Very High';
    if (temp > 25) return 'High';
    if (temp > 15) return 'Moderate';
    if (temp > 5) return 'Low';
    return 'Minimal';
}

// Toast notifications
function showError(message) {
    errorToast.textContent = message;
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 3000);
}

function showSuccess(message) {
    successToast.textContent = message;
    successToast.classList.add('show');
    setTimeout(() => successToast.classList.remove('show'), 3000);
}

// Initialize app
function initApp() {
    updateFavoritesDisplay();
    // Try to get weather for user's location on startup
    if (navigator.geolocation && !currentWeatherData) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log('Location access denied, please search for a city');
            }
        );
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) {
        suggestionsDiv.classList.remove('active');
    }
});