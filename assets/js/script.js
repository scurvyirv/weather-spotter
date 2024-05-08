// declare variables on form
const searchEl = document.querySelector('#city-entry');
const submitEl = document.querySelector('#submit');
const apiKey = '504adfc304ab459bfc9e4d310d1aea32';

//API call using geocode to locate long and lat
function getApi(event) {
    event.preventDefault();
    //Geocode fetch request
    const requestGeocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchEl.value}&limit=1&appid=${apiKey}`;

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
        })

    //store geocode fetch into localStorage (This works!)
    let searchedGeocodeCity;
    if (!localStorage.getItem('searchedGeocodeCity')) {
        searchedGeocodeCity = [];
    }

    if (localStorage.getItem('searchedGeocodeCity')) {
        searchedGeocodeCity = JSON.parse(localStorage.getItem('searchedGeocodeCity'));
    }
    const searchedCity = {
        city: searchEl.value.trim(),
    }
    searchedGeocodeCity.push(searchedCity);

    localStorage.setItem('searchedGeocodeCity', JSON.stringify(searchedGeocodeCity));

    //***render button that has city name and functionally renders weather

    //pull from local storage
    const cityButtonNames = JSON.parse(localStorage.getItem('searchedGeocodeCity'));

    //target HTML container in which button will be created
    const container = document.getElementById('search-entries');

    //define HTML elements using javascript
    function createElement(searchedCity) {
        const cityButton = document.createElement('button');
        cityButton.textContent = searchedCity.city;

        // Modify the style of the button element
        cityButton.style.margin = '10px';
        cityButton.style.fontSize = '20px';

        container.appendChild(cityButton);
    }

    //clear container to remove duplicates...
    container.innerHTML = '';

    // Loop through each value in cityButtonNames and create a button for each value
    cityButtonNames.forEach(function (searchedCity) {
        createElement(searchedCity);
    });

};


// ***we are manipulating how data moves around by making use of arguments in previously invoked function of the same name 'getCurrentWeatherApi(argument1, argument2)

//1 day fetch: API call using 1 day weather
function getCurrentWeatherApi(lat, lon) {
    const requestCurrentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

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

            //store 1 day fetch into local storage
            let searched1day;
            if (!localStorage.getItem('searched1day')) {
                searched1day = [];
            }

            if (localStorage.getItem('searched1day')) {
                searched1day = JSON.parse(localStorage.getItem('searched1day'));
            }
            const oneDayWeather = {
                city: searchEl.value.trim(),
                temperature: temperature,
                humidity: humidity,
                windSpeed: windSpeed,
                icon: iconUrl // Use iconUrl instead of icon.value
            };

            searched1day.push(oneDayWeather);
            localStorage.setItem('searched1day', JSON.stringify(searched1day));

        })
};

//5 day fetch: API call using 5 day weather
function getFiveDayWeatherApi(lat, lon) {
    const requestFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(requestFiveDayUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data); //this lets us see how the API names the variables we want and where they are embedded
            //day 1[0]
            let day1temp = data.list[0].main.temp;
            let day1humidity = data.list[0].main.humidity;
            let day1windSpeed = data.list[0].wind.speed;
            let day1icon = data.list[0].weather[0].icon;
            let day1iconUrl = `https://openweathermap.org/img/wn/${day1icon}@2x.png`;

            //day 2[1]
            let day2temp = data.list[1].main.temp;
            let day2humidity = data.list[1].main.humidity;
            let day2windSpeed = data.list[1].wind.speed;
            let day2icon = data.list[1].weather[0].icon;
            let day2iconUrl = `https://openweathermap.org/img/wn/${day2icon}@2x.png`;

            //day 3[2]
            let day3temp = data.list[2].main.temp;
            let day3humidity = data.list[2].main.humidity;
            let day3windSpeed = data.list[2].wind.speed;
            let day3icon = data.list[2].weather[0].icon;
            let day3iconUrl = `https://openweathermap.org/img/wn/${day3icon}@2x.png`;

            //day 4[3]
            let day4temp = data.list[3].main.temp;
            let day4humidity = data.list[3].main.humidity;
            let day4windSpeed = data.list[3].wind.speed;
            let day4icon = data.list[3].weather[0].icon;
            let day4iconUrl = `https://openweathermap.org/img/wn/${day4icon}@2x.png`;

            //day 5[4]
            let day5temp = data.list[4].main.temp;
            let day5humidity = data.list[4].main.humidity;
            let day5windSpeed = data.list[4].wind.speed;
            let day5icon = data.list[4].weather[0].icon;
            let day5iconUrl = `https://openweathermap.org/img/wn/${day5icon}@2x.png`;

            //store day5 fetch into local storage
            function storeWeatherData(dayNumber, data) {
                let searched5day = [];

                if (!localStorage.getItem(`day${dayNumber}weather`)) {
                    searched5day = [];
                }

                if (localStorage.getItem(`day${dayNumber}weather`)) {
                    searched5day = JSON.parse(localStorage.getItem(`day${dayNumber}weather`));
                }

                const fiveDayWeather = {
                    city: searchEl.value.trim(),
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                };

                searched5day.push(fiveDayWeather);
                localStorage.setItem(`day${dayNumber}weather`, JSON.stringify(searched5day));
            };

            // Call this function for each day's data
            storeWeatherData(1, data.list[0]);
            storeWeatherData(2, data.list[1]);
            storeWeatherData(3, data.list[2]);
            storeWeatherData(4, data.list[3]);
            storeWeatherData(5, data.list[4]);
        });
};

// prevent default + JSON for submission function
submitEl.addEventListener('click', getApi);
