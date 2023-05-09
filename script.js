const submitBtnEl = document.getElementById('submit');
const submitInputEl = document.getElementById('city')
const currentWeatherEl = document.getElementById('current-weather');
const forcastEl = document.getElementById('forcast');

const apiKey = "201ef3350559cb400e5b0d954f191779";

let searchHistory = []




// UPDATES HISTORY OF SEARCHED CITIES
function updateSearchHistoy(city){
    // check if it exists in local storage
    if(localStorage.getItem('search-history') !== null){
        searchHistory = JSON.parse(localStorage.getItem('search-history'));
    }
    searchHistory.push(city)
    localStorage.setItem('search-history', JSON.stringify(searchHistory));

}


// GETS COORDS OF CITY BY CALLING OPENWEATHER'S GEOCODING API
function getCoords(){
    //grab user input
    let city = submitInputEl.value

    console.log('Coords \n---------------')
    // fetches lat and long from openWeathers geocoding api
    fetch('http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=5&appid=' + apiKey)
    .then(function(response){
        if (response.status !== 200){
            alert('Something went wrong. API response not 200')
        } else{
            return response.json();
        }
    })
    .then(function(data){
        if (data.length !== 0){
            console.log(data)
            console.log('here is some data \n----------------\n' + data.length);
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            getWeather(latitude, longitude);
            // TODO: add data to search history 
            updateSearchHistoy(city);
            //  using local storage to store an array of cities


        } else {
            console.log('sorry the data recieved was undefined')
        }
    });

    // let url = 'https: api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon + '&appid=' + apiKey; 
    
}

// GETS WEATHER DATA FROM OPENWEATHER API FOR THE CITY THE USER TYPES IN
function getWeather(lat, lon){
    // fetches the weather from openWeather api using lat and long we got from the other api
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon + '&appid=' + apiKey)
    .then(function(response){
        console.log('Weather \n---------------')
        console.log(response.status);
        if (response.status !== 200){
            alert('Something went wrong. API response not 200')
        } else{
            return response.json();
        }
    })
    .then(function(data){
        // weather data for city we typed in 
        console.log(data)
        renderResults(data)
        
    })
}

function renderResults(data){

    // a counter so we only get the first result for
    let day = dayjs().format("YYYY-MM-DD"); 
    let todayResult = false;
    let temp;
    let wind;
    let humidity;

    for (let i = 0; i < data.list.length; i++){
        console.log(data.list[i].dt_txt)
        // If the date is today and if I havent rendered the most current weather yet
        if (data.list[i].dt_txt.includes(day) && todayResult === false){
            console.log('today')
            console.log(data.list[i].dt_txt);
            temp = Math.trunc(((data.list[i].main.temp - 273.15) * 1.8) + 32, 2);
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;

            //render todays results
            currentWeatherEl.setAttribute('style', 'display: block');
            let tempEl = document.createElement('p');
            let windEl = document.createElement('p');
            let humidityEl = document.createElement('p');
            let headingEl = document.createElement('h2');
            tempEl.textContent = 'Temp: ' + temp + 'F';
            windEl.textContent = 'Wind: ' + wind + ' MPH';
            humidityEl.textContent = 'Humidity: ' + humidity + ' %';
            headingEl.textContent = data.city.name + ' ' + day;
            currentWeatherEl.appendChild(headingEl);
            currentWeatherEl.appendChild(tempEl);
            currentWeatherEl.appendChild(windEl);
            currentWeatherEl.appendChild(humidityEl);

            todayResult = true;

        // if not today
        } else {
            day = data.list[i].dt_txt;
            console.log(data.list[i].main.temp_max)
            //get the highest number for the date

            //sets variables
            temp = Math.trunc(((data.list[i].main.temp - 273.15) * 1.8) + 32, 2);
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;


           
        }
    }
}







// EVENT LISTENER FOR SEARCH BUTTON
submitBtnEl.addEventListener('click', getCoords)




// TODO:
//  RENDER SEARCH HISTORY
//  RENDER WEATHER DATA 
