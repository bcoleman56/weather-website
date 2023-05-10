const submitBtnEl = document.getElementById('submit');
const submitInputEl = document.getElementById('city');
const currentWeatherContainerEl = document.getElementById('container-current-weather');
const forcastContainerEl = document.getElementById('container-forcast');
const citiesSearchedContainerEl = document.getElementById('container-cities-searched');


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
    
    if(searchHistory.includes(city) === false){
        searchHistory.push(city);
    }

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
}


// GETS COORDS OF CITY BY CALLING OPENWEATHER'S GEOCODING API
function getCoords(event){
    
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









function renderResults(data){
    // removes existing elements so multiple versions aren't rendered at the same time
    removeElements();

    // a counter so we only get the first result for
    let day = dayjs().format("YYYY-MM-DD"); 
    let todayResult = false;
    let temp;
    let wind;
    let humidity;

    let tempHigh;
    let windHigh;
    let humidityHigh;


    // CREATES CONTAINER FOR 5-DAY FORCAST AND ITS HEADING
    let forcastEl = document.createElement('div');
    forcastEl.id = 'forcast';
    let headingEl = document.createElement('h2');
    headingEl.id = 'heading';
    headingEl.textContent = '5-Day Forecast';
    forcastContainerEl.appendChild(headingEl);


    searchHistory = JSON.parse(localStorage.getItem('search-history'));

    let citiesSearchedEl = document.createElement('div');
    citiesSearchedEl.id = 'cities-searched';

    
    for (let i = 0; i < searchHistory.length; i++){
        let searchedEl = document.createElement('div');
        searchedEl.textContent = searchHistory[i];
        searchedEl.classList.add('bg-dark', 'text-white', 'p-1', 'm-1');
        citiesSearchedEl.appendChild(searchedEl);
    }
    citiesSearchedContainerEl.appendChild(citiesSearchedEl);
    citiesSearchedContainerEl.setAttribute('style', 'display: block');
    console.log(searchHistory)




    for (let i = 0; i < data.list.length; i++){
        
        // If the date is today and if I havent rendered the most current weather yet
        if (data.list[i].dt_txt.includes(day) && todayResult === false){
            
            temp = kelvinToFahrenheit(data.list[i].main.temp)
          
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;

            //render todays results
            let currentWeatherEl = document.createElement('div');
            currentWeatherEl.classList.add('border' ,'border-dark', 'rounded', 'm-2', 'p-2')
            currentWeatherEl.id = 'current-weather';

            
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

            currentWeatherContainerEl.appendChild(currentWeatherEl);
            

            todayResult = true;

        // if not today
        } else {

            day = data.list[i].dt_txt.slice(0,10);

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
            

            // if it is last data element
            if (data.list.length - 1 === i){
                let dayEl = document.createElement('div');
                let tempEl = document.createElement('p');
                let windEl = document.createElement('p');
                let humidityEl = document.createElement('p');
                tempEl.textContent = 'Temp: ' + tempHigh + ' F';
                windEl.textContent = 'Wind: ' + windHigh + ' MPH';
                humidityEl.textContent = 'Humidity: ' + humidityHigh + ' %';
                dayEl.classList.add('bg-secondary', 'm-2')
                dayEl.appendChild(tempEl);
                dayEl.appendChild(windEl);
                dayEl.appendChild(humidityEl);

                forcastEl.appendChild(dayEl);
                forcastContainerEl.appendChild(forcastEl);
                
            } else if (data.list[i+1].dt_txt.slice(0,10) !== day || data.list.length - 1 === i) {
                //render highs for the day
                
                let dayEl = document.createElement('div');
                let tempEl = document.createElement('p');
                let windEl = document.createElement('p');
                let humidityEl = document.createElement('p');
                tempEl.textContent = 'Temp: ' + tempHigh + ' F';
                windEl.textContent = 'Wind: ' + windHigh + ' MPH';
                humidityEl.textContent = 'Humidity: ' + humidityHigh + ' %';
                dayEl.classList.add('bg-secondary', 'm-2')
                dayEl.appendChild(tempEl);
                dayEl.appendChild(windEl);
                dayEl.appendChild(humidityEl);

                forcastEl.appendChild(dayEl);
                forcastContainerEl.appendChild(forcastEl);

                // sets highs to undefined so it is caught by the if statement above and resets highs for the day
                tempHigh = undefined;
                windHigh = undefined;
                humidityHigh = undefined;
                

            }
            


           
        }
        
    }
    
}







// EVENT LISTENER FOR SEARCH BUTTON
submitBtnEl.addEventListener('click', getCoords)




