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


/* todo List */
const toDoForm = document.querySelector(".js-toDoForm"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-toDoList"),
    checkedList = document.querySelector(".js-checkedList");

const TODOS_LS = "toDos";
const CHEKCKDOS_LS = "checkedList";

let toDos = [];
let checkDos = [];

function checkToDo(event) {
    // transfer from todo to checkedToDo
    const content = event.target.parentNode.textContent;        //event - target - parentNode - textContent
    const checkedDo = content.slice(0, content.length -2);
    const newId = checkDos.length + 1;
    const checkDoObj = {
        text: checkedDo,
        id: newId,
    };
    paintCheckedDo(checkDoObj.text, checkDoObj.id);
    saveCheckedDos();
    // delete from todo localStorage
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);                                   //removeChilde() <->appendChild()
    const cleanToDos = toDos.filter(function(toDo) {
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
    console.log(checkDos);
}

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;                              // select parent 'li' elememt which contains button
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo) {        // filter function to exclude selected element
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
}

function deleteCheckDo(event) {
    const li = event.target.parentNode;
    checkedList.removeChild(li);
    const cleanCheckDos = checkDos.filter(function(checkDo) {
        return checkDo.id !== parseInt(li.id);
    });
    checkDos = cleanCheckDos;
    saveCheckedDos();
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function saveCheckedDos() {
    localStorage.setItem(CHEKCKDOS_LS, JSON.stringify(checkDos));  
}

function loadToDos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);             // localStorage.getItem()
    if (loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo) {                        //forEach function usage
            paintToDo(toDo.text);
        });
    }
}

function loadCheckedDos() {
    const loadedCheckedDos = localStorage.getItem(CHEKCKDOS_LS);
    if(loadedCheckedDos !== null) {
        const parsedCheckDos = JSON.parse(loadedCheckedDos);
        parsedCheckDos.forEach(function(checkDo) {
            paintCheckedDo(checkDo.text, checkDo.id);
        });
    }
}

function paintToDo(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const chkBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.addEventListener("click", deleteToDo);
    delBtn.innerHTML = "❌"; 
    chkBtn.addEventListener("click", checkToDo);
    chkBtn.innerHTML = "✔"; 
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(chkBtn);
    li.appendChild(delBtn);
    li.id = newId;
    toDoList.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId,
    };
    toDos.push(toDoObj);
    saveToDos();
}

function paintCheckedDo(text, id) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");  
    delBtn.innerHTML = "❌"; 
    delBtn.addEventListener("click", deleteCheckDo);
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = id;
    checkedList.appendChild(li);

    const checkDoObj = {
        text,
        id,
    };
    checkDos.push(checkDoObj);
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = "";
}

function init() {
    loadToDos();
    loadCheckedDos();
    toDoForm.addEventListener("submit", handleSubmit)
}

init();
