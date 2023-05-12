const submitBtnEl = document.getElementById('submit');
const submitInputEl = document.getElementById('city');
const currentWeatherContainerEl = document.getElementById('container-current-weather');
const forcastContainerEl = document.getElementById('container-forcast');
const citiesSearchedContainerEl = document.getElementById('container-cities-searched');


const apiKey = "201ef3350559cb400e5b0d954f191779";
let firstDay = dayjs().format('YYYY-MM-DD');



let searchHistory = [];

//function to convert temprature
function kelvinToFahrenheit(kelTemp){
    temp = Math.trunc(((kelTemp - 273.15) * 1.8) + 32, 2);
    return temp;
}


// sets first characters and characters after spaces to uppercase
function formatString(string){
    string = string.toLowerCase();
    
    for (let i = 0; i < string.length; i++){
        if (i === 0){
            newString = string[i].toUpperCase();
        } else if(string[i - 1] === ' '){
            newString = newString.concat(string[i].toUpperCase())
        } else{
            newString = newString.concat(string[i])
        }
    }
    return newString;
}



//------UPDATES SEARCH HISTORY FOR CITIES---------------------------------------------------------------


function updateSearchHistoy(city){
    // check if it exists in local storage
    city = formatString(city)
    
    // if search history variable is in local storage
    if(localStorage.getItem('search-history') !== null){
        searchHistory = JSON.parse(localStorage.getItem('search-history'));
    } 
    
    if(searchHistory.includes(city) === false){
        searchHistory.push(city);
    }
    
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
}




// gets city name from button clicks to call api with
function getCityName(event){
    if(event.target.id === 'submit'){
        let city = submitInputEl.value;
        getCoords(city);
    }else {
        let city = event.target.textContent;
        //puts city name in search bar
        submitInputEl.value = city;
        // getButton();
        getCoords(city);
    }
    
}

//-------CALL GEO-COORDS API---------------------------------------------------------------------------


function getCoords(city){

    // fetches lat and long from openWeathers geocoding api
    fetch('https://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=5&appid=' + apiKey)
    .then(function(response){
        if (response.status !== 200){
            alert('Something went wrong. API response not 200')
        } else{
            return response.json();
        }
    })
    .then(function(data){
        if (data.length !== 0){
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            getForecast(latitude, longitude);
            getCurrent(latitude, longitude);
            // TODO: add data to search history 
            updateSearchHistoy(city);
            //  using local storage to store an array of cities


        } else {
            console.log('sorry the data recieved was undefined')
        }
    });

    // let url = 'https: api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon + '&appid=' + apiKey; 
    
}


//--------CALL WEATHER API-----------------------------------------------------------------------------

function getForecast(lat, lon){
    // fetches the weather from openWeather api using lat and long we got from the other api
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon + '&appid=' + apiKey)
    .then(function(response){
        
        if (response.status !== 200){
            alert('Something went wrong. API response not 200')
        } else{
            return response.json();
        }
    })
    .then(function(data){
        // weather data for city we typed in 
        renderFiveDay(data)

    })
}


function getCurrent(lat, lon){
    
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey)
    .then(function(response){
        if (response.status !== 200){
            alert('Something went wrong. API response not 200')
        } else{
            return response.json();
        }
    })
    .then(function(data){

        renderCurrent(data)
    })
}




//-----REMOVE ELEMENTS ADDED THROUGH JS----------------------------------------------------------------

function removeElements(){
    // removes elements if they exist, so they aren't repeated

    if (document.getElementById('current-weather')){
        document.getElementById('current-weather').remove();
    }
    if (document.getElementById('forcast')){
        document.getElementById('forcast').remove();
    }
    if (document.getElementById('cities-searched')){
        document.getElementById('cities-searched').remove();
    }
    if (document.getElementById('heading')){
        document.getElementById('heading').remove();
    }
    
}


//----RENDER RESULTS-----------------------------------------------------------------------------------


function renderCurrent(data){
    let day = firstDay;

    temp = kelvinToFahrenheit(data.main.temp)
    wind = data.wind.speed;
    humidity = data.main.humidity;

    //render todays results
    let currentWeatherEl = document.createElement('div');
    currentWeatherEl.classList.add('border' ,'border-dark', 'rounded', 'm-2', 'p-2')
    currentWeatherEl.id = 'current-weather';

    

    currentWeatherEl.setAttribute('style', 'display: block');
    
    let tempEl = document.createElement('p');
    let windEl = document.createElement('p');
    let humidityEl = document.createElement('p');
    let headingEl = document.createElement('h2');
    tempEl.textContent = 'Temp: ' + temp + ' F';
    windEl.textContent = 'Wind: ' + wind + ' MPH';
    humidityEl.textContent = 'Humidity: ' + humidity + ' %';
    headingEl.textContent = data.name + ' ' + day;
    currentWeatherEl.appendChild(headingEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);

    currentWeatherContainerEl.appendChild(currentWeatherEl);


}


function renderFiveDay(data){
    // removes existing elements so multiple versions aren't rendered at the same time
    removeElements();
    
    //defines variables
    let temp;
    let wind;
    let humidity;

    let tempHigh;
    let windHigh;
    let humidityHigh;


    // CREATES CONTAINER FOR 5-DAY FORCAST AND ITS HEADING
    let forcastEl = document.createElement('div');
    forcastEl.setAttribute('style', 'display: flex');
    forcastEl.id = 'forcast';
    let headingEl = document.createElement('h2');
    headingEl.id = 'heading';
    headingEl.textContent = '5-Day Forecast:';
    forcastContainerEl.appendChild(headingEl);


    searchHistory = JSON.parse(localStorage.getItem('search-history'));

    let citiesSearchedEl = document.createElement('div');
    citiesSearchedEl.id = 'cities-searched';
    citiesSearchedEl.classList.add('btn-group-vertical', 'w-100');
    

    
    for (let i = 0; i < searchHistory.length; i++){
        let searchedEl = document.createElement('button');
        searchedEl.textContent = searchHistory[i];
        searchedEl.classList.add('btn-light', 'btn', 'p-1','w-100');
        citiesSearchedEl.appendChild(searchedEl);
    }
    citiesSearchedContainerEl.appendChild(citiesSearchedEl);
    citiesSearchedContainerEl.setAttribute('style', 'display: block');
    console.log(searchHistory)



    //loops through array

    let days = 0;
    for (let i = 0; i < data.list.length; i++){
        let day = data.list[i].dt_txt.slice(0,10);

        if (days < 5){
            // if not today
            if (day !== firstDay){

                //sets variables for weather data
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
                

                // RENDERS 5 DAY FORECAST
                if (data.list[i+1] === undefined || data.list[i+1].dt_txt.slice(0,10) !== day || data.list.length - 1 === i ) {
                    // render highs for the day

                    
                    let dayEl = document.createElement('div');
                    let dateEl = document.createElement('h5');
                    let imgEl = document.createElement('img');
                    let tempEl = document.createElement('p');
                    let windEl = document.createElement('p');
                    let humidityEl = document.createElement('p');

                    dateEl.textContent = day;
                    imgEl.src = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png';
                    imgEl.classList.add('img')
                    tempEl.textContent = 'Temp: ' + tempHigh + ' F';
                    windEl.textContent = 'Wind: ' + windHigh + ' MPH';
                    humidityEl.textContent = 'Humidity: ' + humidityHigh + ' %';

                    dayEl.classList.add('bg-primary', 'text-white', 'border', 'border-dark', 'rounded', 'm-2', 'p-2')
                    dayEl.appendChild(dateEl);
                    dayEl.appendChild(imgEl);
                    dayEl.appendChild(tempEl);
                    dayEl.appendChild(windEl);
                    dayEl.appendChild(humidityEl);

                    forcastEl.appendChild(dayEl);
                    forcastContainerEl.appendChild(forcastEl);

                    // sets highs to undefined so it is caught by the if statement above and resets highs for the day
                    tempHigh = undefined;
                    windHigh = undefined;
                    humidityHigh = undefined;

                    days++;
                    
                }
        
            }
        }
    }
}


// EVENT LISTENER FOR SEARCH BUTTON
submitBtnEl.addEventListener('click', getCityName)
citiesSearchedContainerEl.addEventListener('click', getCityName)





