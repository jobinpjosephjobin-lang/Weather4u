const API_KEY = "6379c02462e04c51a05174111260103";

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("ഈ ബ്രൗസറിൽ ലൊക്കേഷൻ പിന്തുണയില്ല");
}

function success(position) {
    fetchWeather(position.coords.latitude, position.coords.longitude);
}

function error() {
    alert("ദയവായി ലൊക്കേഷൻ അനുവദിക്കുക");
}

function fetchWeather(lat, lon) {

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`)
        .then(res => res.json())
        .then(data => {

            const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain;
            const condition = data.current.condition.text;

            document.getElementById("location").innerText =
                `${data.location.name}, ${data.location.region}`;

            document.getElementById("temp").innerText =
                `${data.current.temp_c}°C`;

            document.getElementById("condition").innerText =
                translateCondition(condition);

            document.getElementById("humidity").innerText =
                data.current.humidity;

            document.getElementById("feels").innerText =
                data.current.feelslike_c;

            document.getElementById("rain").innerText = rainChance;

            // Forecast
            const tomorrow = data.forecast.forecastday[1];
            const dayAfter = data.forecast.forecastday[2];

            document.getElementById("forecast").innerHTML = `
                📅 നാളെ: ${getPrediction(tomorrow.day.daily_chance_of_rain)} <br><br>
                📅 മറ്റന്നാൾ: ${getPrediction(dayAfter.day.daily_chance_of_rain)}
            `;

            // 🎬 Animation Logic
            applyAnimation(rainChance, condition);

        });
}

function applyAnimation(rainChance, condition) {

    const rainContainer = document.getElementById("rain-container");
    const sunContainer = document.getElementById("sun-container");

    rainContainer.innerHTML = "";
    sunContainer.style.display = "none";

    if (rainChance >= 50) {
        document.body.style.background = "linear-gradient(to bottom, #1e3c72, #2a5298)";
        createRain();
    }
    else if (condition.includes("Sunny")) {
        document.body.style.background = "linear-gradient(to bottom, #f7971e, #ffd200)";
        sunContainer.style.display = "block";
    }
    else {
        document.body.style.background = "linear-gradient(to bottom, #757f9a, #d7dde8)";
    }
}

function createRain() {
    const rainContainer = document.getElementById("rain-container");

    for (let i = 0; i < 120; i++) {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
        rainContainer.appendChild(drop);
    }
}

function getPrediction(rainChance) {
    if (rainChance >= 50) {
        return `മഴയ്ക്ക് സാധ്യത 🌧 (${rainChance}%)`;
    } else {
        return `സൂര്യപ്രകാശമുള്ള ദിവസം ☀️ (${rainChance}% മഴ സാധ്യത)`;
    }
}

function translateCondition(condition) {
    const translations = {
        "Sunny": "സൂര്യപ്രകാശം ☀️",
        "Cloudy": "മേഘാവൃതം ☁️",
        "Partly cloudy": "ഭാഗികമായി മേഘാവൃതം 🌤",
        "Rain": "മഴ 🌧"
    };
    return translations[condition] || condition;
}

// 🔄 15 മിനിറ്റ് റിഫ്രഷ്
setInterval(() => {
    location.reload();
}, 15 * 60 * 1000);
