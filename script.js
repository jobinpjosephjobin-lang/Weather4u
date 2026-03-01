const API_KEY = "6379c02462e04c51a05174111260103";

window.onload = function () {

    if (!navigator.geolocation) {
        showError("ലൊക്കേഷൻ പിന്തുണയില്ല");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => showError("ലൊക്കേഷൻ അനുവദിക്കുക")
    );
};

function fetchWeather(lat, lon) {

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3`)
        .then(res => res.json())
        .then(data => {

            if (!data || !data.current) {
                showError("ഡാറ്റ ലഭ്യമല്ല");
                return;
            }

            const rainChance = parseInt(data.forecast.forecastday[0].day.daily_chance_of_rain);

            document.getElementById("location").innerText =
                data.location.name + ", " + data.location.region;

            document.getElementById("temp").innerText =
                data.current.temp_c + "°C";

            document.getElementById("condition").innerText =
                data.current.condition.text;

            document.getElementById("humidity").innerText =
                data.current.humidity;

            document.getElementById("feels").innerText =
                data.current.feelslike_c;

            document.getElementById("rain").innerText = rainChance;

            // 2 ദിവസം പ്രവചനം
            const tomorrow = data.forecast.forecastday[1];
            const dayAfter = data.forecast.forecastday[2];

            document.getElementById("forecast").innerHTML =
                "📅 നാളെ: " + getPrediction(tomorrow.day.daily_chance_of_rain) +
                "<br><br>📅 മറ്റന്നാൾ: " + getPrediction(dayAfter.day.daily_chance_of_rain);

            applyAnimation(rainChance, data.current.condition.text);

        })
        .catch(() => {
            showError("കാലാവസ്ഥ ലഭ്യമല്ല");
        });
}

function getPrediction(rainChance) {
    rainChance = parseInt(rainChance);
    if (rainChance >= 50) {
        return "മഴയ്ക്ക് സാധ്യത 🌧 (" + rainChance + "%)";
    } else {
        return "സൂര്യപ്രകാശം ☀️ (" + rainChance + "% മഴ സാധ്യത)";
    }
}

function applyAnimation(rainChance, condition) {

    const rainContainer = document.getElementById("rain-container");
    const sunContainer = document.getElementById("sun-container");

    rainContainer.innerHTML = "";
    sunContainer.style.display = "none";

    if (rainChance >= 50) {
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement("div");
            drop.className = "raindrop";
            drop.style.left = Math.random() * 100 + "vw";
            drop.style.animationDuration = (Math.random() + 0.5) + "s";
            rainContainer.appendChild(drop);
        }
    } else if (condition.includes("Sunny")) {
        sunContainer.style.display = "block";
    }
}

function showError(message) {
    document.getElementById("forecast").innerText = message;
}

// 15 മിനിറ്റ് റിഫ്രഷ്
setInterval(() => {
    location.reload();
}, 15 * 60 * 1000);
