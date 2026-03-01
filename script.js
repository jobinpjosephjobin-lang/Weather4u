const API_KEY = "6379c02462e04c51a05174111260103";

// Get User Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("Geolocation is not supported by this browser.");
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetchWeather(lat, lon);
}

function error() {
    alert("Please allow location access.");
}

function fetchWeather(lat, lon) {

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&aqi=no&alerts=no`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("location").innerText =
                `${data.location.name}, ${data.location.country}`;

            document.getElementById("temp").innerText =
                `${data.current.temp_c}°C`;

            document.getElementById("condition").innerText =
                data.current.condition.text;

            document.getElementById("humidity").innerText =
                data.current.humidity;

            document.getElementById("feels").innerText =
                data.current.feelslike_c;

            document.getElementById("rain").innerText =
                data.forecast.forecastday[0].day.daily_chance_of_rain;
        })
        .catch(() => {
            alert("Weather data unavailable.");
        });
}
