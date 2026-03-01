const API_KEY = "6379c02462e04c51a05174111260103";

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("ഈ ബ്രൗസറിൽ ലൊക്കേഷൻ പിന്തുണയില്ല");
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(lat, lon);
}

function error() {
    alert("ദയവായി ലൊക്കേഷൻ അനുവദിക്കുക");
}

function fetchWeather(lat, lon) {

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`)
        .then(res => res.json())
        .then(data => {

            // നിലവിലെ കാലാവസ്ഥ
            document.getElementById("location").innerText =
                `${data.location.name}, ${data.location.region}`;

            document.getElementById("temp").innerText =
                `${data.current.temp_c}°C`;

            document.getElementById("condition").innerText =
                translateCondition(data.current.condition.text);

            document.getElementById("humidity").innerText =
                data.current.humidity;

            document.getElementById("feels").innerText =
                data.current.feelslike_c;

            document.getElementById("rain").innerText =
                data.forecast.forecastday[0].day.daily_chance_of_rain;

            // അടുത്ത 2 ദിവസത്തെ പ്രവചനം
            const tomorrow = data.forecast.forecastday[1];
            const dayAfter = data.forecast.forecastday[2];

            const forecastHTML = `
                📅 നാളെ: ${getPrediction(tomorrow.day.daily_chance_of_rain)} <br><br>
                📅 മറ്റന്നാൾ: ${getPrediction(dayAfter.day.daily_chance_of_rain)}
            `;

            document.getElementById("forecast").innerHTML = forecastHTML;

        })
        .catch(() => {
            alert("കാലാവസ്ഥ വിവരങ്ങൾ ലഭ്യമല്ല");
        });
}

// മഴ / സൂര്യപ്രകാശം തീരുമാനിക്കൽ
function getPrediction(rainChance) {

    if (rainChance >= 50) {
        return `മഴയ്ക്ക് സാധ്യത 🌧 (${rainChance}%)`;
    } else {
        return `സൂര്യപ്രകാശമുള്ള ദിവസം ☀️ (${rainChance}% മഴ സാധ്യത)`;
    }
}

// കാലാവസ്ഥ വിവരണം മലയാളത്തിലേക്ക് മാറ്റൽ
function translateCondition(condition) {

    const translations = {
        "Sunny": "സൂര്യപ്രകാശം ☀️",
        "Partly cloudy": "ഭാഗികമായി മേഘാവൃതം 🌤",
        "Cloudy": "മേഘാവൃതം ☁️",
        "Overcast": "കട്ടിയുള്ള മേഘാവൃതം ☁️",
        "Mist": "മഞ്ഞ് 🌫",
        "Rain": "മഴ 🌧",
        "Light rain": "ലഘു മഴ 🌦",
        "Heavy rain": "കടുത്ത മഴ 🌧",
        "Thunderstorm": "ഇടിമിന്നൽ മഴ ⛈"
    };

    return translations[condition] || condition;
}
