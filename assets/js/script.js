// API key (insert your own API key here)
const API_KEY = "096e002965be779548e85ad4cca06d1c";

// Get DOM elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchHistory = document.getElementById("search-history");
const searchHistoryList = searchHistory.querySelector("ul");
const currentWeatherContainer = document.getElementById("current-weather-container");
const forecastContainer = document.getElementById("forecast-container");

// Initialize search history array
let searchHistoryArr = [];

// Event listener for search form submission
searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchCity(searchTerm);
  }
});

// Event listener for search history clicks
searchHistoryList.addEventListener("click", function(event) {
  const searchTerm = event.target.textContent;
  searchCity(searchTerm);
});

// Function to search for city weather data
function searchCity(searchTerm) {
  // Add search term to search history
  addSearchTerm(searchTerm);

  // Clear previous weather data
  clearWeatherData();

  // API call to retrieve current weather data for the city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.error(error);
      alert("Error retrieving weather data. Please try again.");
    });

  // API call to retrieve 5-day forecast data for the city
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error(error);
      alert("Error retrieving weather data. Please try again.");
    });
}

// Function to add search term to search history
function addSearchTerm(searchTerm) {
  // Add search term to array and local storage
  searchHistoryArr.unshift(searchTerm);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));

  // Clear search history list
  searchHistoryList.innerHTML = "";

  // Display updated search history
  searchHistoryArr.forEach(searchTerm => {
    const li = document.createElement("li");
    li.textContent = searchTerm;
    searchHistoryList.appendChild(li);
  });
}
  // Function to display current weather data
function displayCurrentWeather(data) {
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const temp = `${Math.round((data.main.temp - 273.15) * 9/5 + 32)}\xB0F`;
    const humidity = `${data.main.humidity}%`;
    const windSpeed = `${Math.round(data.wind.speed)} mph`;
  
    const currentWeatherHtml = `
      <div class="current-weather-item">
        <h3>${cityName}</h3>
        <p>${date}</p>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p class="temp">${temp}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
      </div>
    `;
    currentWeatherContainer.innerHTML = currentWeatherHtml;
  }
  
// Function to display forecast data
function displayForecast(data) {
    const forecastData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastHtml = forecastData.map(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {month: "numeric", day: "numeric"});
      const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
      const temp = `${Math.round((item.main.temp - 273.15) * 9/5 + 32)}\xB0F`;
      const humidity = `${item.main.humidity}%`;
      const windSpeed = `${Math.round(item.wind.speed)} mph`;
      return `
        <div class="forecast-item">
          <h3>${date}</h3>
          <img src="${iconUrl}" alt="${item.weather[0].description}">
          <p class="temp">${temp}</p>
          <p>Humidity: ${humidity}</p>
          <p>Wind Speed: ${windSpeed}</p>
        </div>
      `;
    }).join("");
    forecastContainer.innerHTML = forecastHtml;
  }
  
// Function to clear weather data
function clearWeatherData() {
currentWeatherContainer.innerHTML = "";
forecastContainer.innerHTML = "";
}

// Load search history from local storage
if (localStorage.getItem("searchHistory")) {
searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
searchHistoryArr.forEach(searchTerm => {
const li = document.createElement("li");
li.textContent = searchTerm;
searchHistoryList.appendChild(li);
});
}
  