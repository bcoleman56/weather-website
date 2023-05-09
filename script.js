const submitBtnEl = document.getElementById('submit');
const submitInputEl = document.getElementById('city')
const currentWeatherEl = document.getElementById('current-weather');
const forcastEl = document.getElementById('forcast');

const apiKey = "201ef3350559cb400e5b0d954f191779";

let searchHistory = []

//function to convert temprature
function kelvinToFahrenheit(kelTemp){
    temp = Math.trunc(((kelTemp - 273.15) * 1.8) + 32, 2);
    return temp;
}

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

    let tempHigh;
    let windHigh;
    let humidityHigh;

    for (let i = 0; i < data.list.length; i++){
        console.log(data.list[i].dt_txt)
        // If the date is today and if I havent rendered the most current weather yet
        if (data.list[i].dt_txt.includes(day) && todayResult === false){
            console.log('today')
            console.log(data.list[i].dt_txt);
            temp = kelvinToFahrenheit(data.list[i].main.temp)
            console.log(temp)
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;

            //render todays results
            currentWeatherEl.setAttribute('style', 'display: block');
            forcastEl.setAttribute('style', 'display: flex');
            let tempEl = document.createElement('p');
            let windEl = document.createElement('p');
            let humidityEl = document.createElement('p');
            let headingEl = document.createElement('h2');
            tempEl.textContent = 'Temp: ' + temp + ' F';
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

            day = data.list[i].dt_txt.slice(0,10);

            //sets variables
            temp = kelvinToFahrenheit(data.list[i].main.temp)
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;

            // if its the first time in the array for the next day we set those values as the highs
            if (tempHigh === undefined){
                tempHigh = temp;
                windHigh = wind;
                humidityHigh = humidity;
            }

            // GET HIGHS
            if (temp > tempHigh){tempHigh = temp}
            if (wind > windHigh){windHigh = wind}
            if (humidity > humidityHigh){humidityHigh = humidity}
            console.log(temp)

            // if it is last data element
            if (data.list.length - 1 === i){

            } else if (data.list[i+1].dt_txt.slice(0,10) !== day) {
                //render highs for the day
                let dayEl = document.createElement('div');
                let tempEl = document.createElement('p');
                let windEl = document.createElement('p');
                let humidityEl = document.createElement('p');
                tempEl.textContent = 'Temp: ' + tempHigh + ' F';
                windEl.textContent = 'Wind: ' + windHigh + ' MPH';
                humidityEl.textContent = 'Humidity: ' + humidityHigh + ' %';
                dayEl.appendChild(tempEl);
                dayEl.appendChild(windEl);
                dayEl.appendChild(humidityEl);

                forcastEl.appendChild(dayEl);
                

            }
            


           
        }
        
    }
    console.log(tempHigh)
}







// EVENT LISTENER FOR SEARCH BUTTON
submitBtnEl.addEventListener('click', getCoords)




// TODO:
//  RENDER SEARCH HISTORY
//  RENDER WEATHER DATA 
