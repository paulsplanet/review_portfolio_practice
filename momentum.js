/* javascript element selectors */

const body = document.querySelector("body");

/* create a new HTML Image Element */
const Img = new Image();   // this is equal to document.createElement('img');
Img.src = "";               // add src on image element
Img.classList.add("####")   // add class on image element

/* create child element */
body.appendChild(Img)       //create child element Img under the body

/* create random number */
const number = Math.ceil(Math.random() * numberOfFactors )      //Math.ceil is make number interger upward

/* fetch API */
function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
    fetch(url)
    .then(function(response) {
        return response.json();     //json() method takde a response and read it, result is javascript Object
    })
    .then(function(json) {
        const temperature = json.main.temp;
        const place = json.name;
        const icon = json.weather[0].icon;
        const iconurl = `http://openweathermap.org/img/w/${icon}.png`;
        const weatherDescription = json.weather[0].description;
        weatherIcon.src = iconurl;                                      // put data into already selected element. 
        description.innerHTML = `${weatherDescription}`;                // same
        weather.innerHTML = `${temperature} &ordm;C @ ${place}`;        // same, &ordm; is hex code or html code
    });
}

/* get coords (coordinates) */
function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));        //use localStorage, JSON.stringify: object -> JSON
}
function handleGeoSucces(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
    hourWeather(latitude, longitude);
}
function handleGeoError() {
    console.log("We can't find your location")
}
function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError)   //navigator.geolocation
}
function loadCoords() {                                                         // initiate function
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);                          //JSON.parse: JSON -> object
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
        hourWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

/* use Date() */
function getTime() {
    const date = new Date();
    const min = date.getMinutes();
    const hr = date.getHours();
    const sec = date.getSeconds();
    clockTitle.innerHTML = `${hr > 12 ? `${hr-12}` : hr}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
    ampmm.innerHTML = `${hr > 12 ? "PM" : "AM"}`;                       //innerHTML is setting texting on the screen
}
function init() {
    getTime();
    setInterval(getTime, 1000);                         // setInterveral(X, 1000), start X function every 1S.
}

/* add function using javascript */
function handleSubmit(event) {
    event.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}
function askForName() {
    form.classList.add(SHOWING_CN);                     // show the element only in this case by using classname and CSS
    form.addEventListener("submit", handleSubmit);
}

/* make it Capital letter */
let newText = text.charAt(0).toUpperCase() + text.slice(1);


