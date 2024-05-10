// declare variables on form
const submitEl = document.querySelector('#submit');
const apiKey = '504adfc304ab459bfc9e4d310d1aea32';

//API call using geocode to locate long and lat
function getApi(event) {
    event.preventDefault();
    const searchEl = document.querySelector('#city-entry');
    //Geocode fetch request
    const requestGeocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchEl.value}&limit=1&appid=${apiKey}`;

    fetch(requestGeocodeUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            console.log(latitude, longitude); //checks if our variable is who it says it is

            //invoke getCurrentWeatherApi AND getFiveDayWeatherApi ***this invocation corresponds to comment on manipulating how data moves
            getCurrentWeatherApi(latitude, longitude);
            getFiveDayWeatherApi(latitude, longitude);
            storeGeocodeData(latitude,longitude);
            renderCityButton(latitude, longitude);
        })
};

//store geocode fetch into localStorage (This works!)
function storeGeocodeData(latitude, longitude) {
    let searchedGeocodeCity;
    const searchEl = document.querySelector('#city-entry');
    if (!localStorage.getItem('searchedGeocodeCity')) {
        searchedGeocodeCity = [];
    }
    if (localStorage.getItem('searchedGeocodeCity')) {
            searchedGeocodeCity = JSON.parse(localStorage.getItem('searchedGeocodeCity'));
        }
        const searchedCity = {
            city: searchEl.value.trim(),
            lat: latitude,
            lon: longitude
        };
        searchedGeocodeCity.push(searchedCity);
        localStorage.setItem('searchedGeocodeCity', JSON.stringify(searchedGeocodeCity));
        
        
};

//Render button that has city name and functionally renders weather
function renderCityButton() {
    //pull from local storage
    const cityButtonNames = JSON.parse(localStorage.getItem('searchedGeocodeCity'));
    const container = document.getElementById('search-entries');

    container.innerHTML = '';

    // Loop through each cityButtonNames and create a button for each city  
    cityButtonNames.forEach(function (searchedCity) {
        const cityButton = document.createElement('button');
        cityButton.textContent = searchedCity.city;
        cityButton.style.margin = '10px';
        cityButton.style.fontSize = '20px';

        cityButton.addEventListener('click', function () {
            //call fetch API functions for current and fiveDay weather
            getCurrentWeatherApi(searchedCity.lat, searchedCity.lon);
            getFiveDayWeatherApi(searchedCity.lat, searchedCity.lon);
        });
        //append newly created button with new city entry
        container.appendChild(cityButton);
    })
};


// ***we are manipulating how data moves around by making use of arguments in previously invoked function of the same name 'getCurrentWeatherApi(argument1, argument2)

//1 day fetch: API call using 1 day weather
function getCurrentWeatherApi(latitude, longitude) {
    const requestCurrentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(requestCurrentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let temperature = data.main.temp;
            let humidity = data.main.humidity;
            let windSpeed = data.wind.speed;
            let icon = data.weather[0].icon; //needs a URL? check doc
            let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            const searchEl = document.querySelector('#city-entry');
            //stores fetched current weather into an object
            const currentWeather = {
                city: searchEl.value.trim(),
                temperature: temperature,
                humidity: humidity,
                windSpeed: windSpeed,
                icon: iconUrl,
                lat: latitude,
                lon: longitude
            };

            renderCurrentWeather(currentWeather);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}


// render current weather
function renderCurrentWeather(currentWeather) {
    const currentWeatherContainer = document.querySelector('.current-weather');
    currentWeatherContainer.innerHTML = ''; //removes placeholder gif upon first entry

    //create new elements
    let currentCityName = document.createElement('h1');
    currentCityName.textContent = currentWeather.city;
    currentCityName.style.color = 'yellow';
    currentCityName.style.fontSize = '30px';

    let currentCityTemp = document.createElement('h3')
    currentCityTemp.textContent = `${Math.round(currentWeather.temperature)} °F`;
    currentCityTemp.style.color = 'beige';

    let currentCityHum = document.createElement('h3');
    currentCityHum.textContent = `${currentWeather.humidity} %`;
    currentCityHum.style.color = 'beige';

    let currentCityWindSpeed = document.createElement('h3');
    currentCityWindSpeed.textContent = `${Math.round(currentWeather.windSpeed)} mph`;
    currentCityWindSpeed.style.color = 'beige';

    let currentCityIcon = document.createElement('img');
    currentCityIcon.src = currentWeather.icon;

    //append to render currentWeather
    currentWeatherContainer.appendChild(currentCityName);
    currentWeatherContainer.appendChild(currentCityTemp);
    currentWeatherContainer.appendChild(currentCityHum);
    currentWeatherContainer.appendChild(currentCityWindSpeed);
    currentWeatherContainer.appendChild(currentCityIcon);
};

//5 day fetch: API call using 5 day weather
function getFiveDayWeatherApi(latitude, longitude) {
    const requestFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(requestFiveDayUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data); //this lets us see how the API names the variables we want and where they are embedded

            //initialize array 
            let fiveDayWeather = [];
            //loop for every 8th array in the list from the console
            for (let i = 0; i < data.list.length; i += 8) {
                let dayTemp = data.list[i].main.temp;
                let dayHumidity = data.list[i].main.humidity;
                let dayWindSpeed = data.list[i].wind.speed;
                let dayIcon = data.list[i].weather[0].icon;
                let dayIconUrl = `https://openweathermap.org/img/wn/${dayIcon}@2x.png`;

                //store weather data for each day in an object
                let dayWeather = {
                    temp: dayTemp,
                    humidity: dayHumidity,
                    windSpeed: dayWindSpeed,
                    icon: dayIcon,
                    iconUrl: dayIconUrl,
                    lat: latitude,
                    lon: longitude
                }
                //push weather data for each day into fiveDayWeather array
                fiveDayWeather.push(dayWeather)
            }
            // check array of fiveDayWeather
            console.log(fiveDayWeather);
            renderFiveDayWeather(fiveDayWeather);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
};

//render five day weather
function renderFiveDayWeather(fiveDayWeather) {
    const fiveDayWeatherContainer = document.querySelector('.five-day-weather');
    fiveDayWeatherContainer.innerHTML = '';

    // loop through five day weather data
    for (let i = 0; i < fiveDayWeather.length; i++) {

        // create outer container for holding five day weather data
        let fiveDayContainer = document.createElement('div');
        fiveDayContainer.setAttribute('class', 'five-day-weather');

        // create inner container for each day
        let dayContainer = document.createElement('div');
        dayContainer.setAttribute('class', `day-${i}`);

        // Update the text content for each day's container with div elements
        dayContainer.innerHTML = `
        <div style="color:yellow; font-size:20px; font-weight:bold; padding-bottom: 10px;"> Day ${i + 1} </div>
        <div>${Math.round(fiveDayWeather[i].temp)} °F</div>
        <div>${fiveDayWeather[i].humidity}% humidity</div>
        <div>${Math.round(fiveDayWeather[i].windSpeed)} mph</div>
        <img src = "${fiveDayWeather[i].iconUrl}" alt ="weather icon" </img>
        `;

        // append the inner container to the outer container
        fiveDayContainer.appendChild(dayContainer);

        // append the outer container to the document body
        fiveDayWeatherContainer.appendChild(fiveDayContainer);
    }

};

// prevent default + JSON for submission function
submitEl.addEventListener('click', getApi);
