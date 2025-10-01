function getWeather(){
    const apiKey = 'your-actual-api-key-here'; // REPLACE WITH REAL API KEY
    let city = document.getElementById("city").value;
    
    if(!city){
        alert('Please enter a city');
        return;
    }
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
    
    // Fetch forecast
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data){
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    
    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    
    if(data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p style="font-size: 2rem; font-weight: bold;">${temperature}°C</p>`;
        const weatherHtml = `
            <h2>${cityName}</h2>
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData){
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '<h3>24-Hour Forecast</h3>';
    
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item" style="display: inline-block; text-align: center; margin: 10px; padding: 10px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <span style="display: block; font-weight: bold;">${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon" style="width: 50px; height: 50px;">
                <span style="display: block;">${temperature}°C</span>
            </div>
        `;
        
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage(){
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

// Optional: Add event listener for Enter key
document.getElementById('city').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Optional: Test function to verify API key
function testAPIKey() {
    const apiKey = 'your-actual-api-key-here';
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`;
    
    fetch(testUrl)
        .then(response => {
            console.log('API Response Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Full API Response:', data);
            if (data.cod === 401) {
                console.error('INVALID API KEY - Please get a valid key from openweathermap.org');
            }
        })
        .catch(error => console.error('API Test Failed:', error));
}

// Uncomment the line below to test your API key:
// testAPIKey();