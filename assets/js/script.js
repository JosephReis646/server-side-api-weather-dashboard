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
  
  