let Api_key = "0c618783e717de8c4e7ada7cf92e8daf";

const cityName = document.getElementById("cityName");
const button = document.querySelector("button");
const searchIcon = document.querySelector("span");
const report = document.getElementsByClassName("output_container");
let tempreature = document.getElementById("temp");
let windSpeed = document.getElementById("wind.speed");
let responce_city_name = document.getElementById("responce_city_name");
let date = document.getElementById("date_display");
let weather_image = document.getElementById("weather_image");
let forcast_weather = document.getElementById("days_weather");
button.addEventListener("click", checkTheWeather);
searchIcon.addEventListener("click", checkTheWeather);

function checkTheWeather($event) {
  $event.preventDefault();
  getData();
}

//!------------------------- get data function for main weather data----------------------------------------------- ///
async function getData() {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName.value +
      "&APPID=" +
      Api_key
  )
    .then(function (responce) {
      return responce.json();
    })
    .then(function (jsonData) {
      let data = jsonData;
      //console.log("responce data -", data);
      let city_id = data.id;

      // console.log(city_id, "weather city id");
      showData(data);
      forcast(city_id);
    })
    .catch(function (err) {
      console.log("Fetch problem: " + err.message);
    });
}
//!------------------------- Finish get data function for main weather data----------------------------------------------- ///
//* u can use documentation to get other matreics too : unit metrics //

//!------------------------- show data function for main weather data----------------------------------------------- ///
function showData(data) {
  //console.log("Tem -", data.main.temp);
  let celcius = Math.round(parseFloat(data.main.temp) - 273.15);
  let farenhite = Math.round(
    (parseFloat(data.main.feels_like) - 273.15) * 1.8 + 32
  );

  tempreature.textContent = celcius + "°C";
  windSpeed.textContent = "Today " + data.weather[0].description + ".";
  responce_city_name.textContent = data.name + ", " + data.sys.country;

  //* add icon - openweather icon //
  weather_image.src =
    "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  date.textContent = dayOfWeek();
}
//!------------------------- End show data function for main weather data----------------------------------------------- ///

//!------------------------- show date function----------------------------------------------- ///
let dayOfWeek = (dt = new Date().getTime()) => {
  //? we use 'long' , cz we need long value. there is a option , u can get short value too //
  return new Date(dt).toLocaleDateString("en-En", {
    weekday: "long",
  });
};
//!------------------------- End show date function ------------------------------------///

//! ------------------------- forcast fuction ---------------------------------------------------------------------- //
//* here i call the function for city id //
async function forcast(city_id) {
  let result = await fetch(
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
      city_id +
      "&appid=" +
      Api_key
  );
  let forcast = await result.json();
  console.log(forcast); //* see this forcast, dt.txt , u'll see the date and time, we need to take daily forcast. so we have to get DAY : 12 u time //*
  let forcastList = forcast.list; //* forcast.list //*
  let display_days = [];

  forcastList.forEach((singleDay) => {
    //*console.log("dates apart weather forcast ", singleDay);  u get all days apart here as a arraya* //
    //* Now we need to get everyday 12.00 noon weather => date MDN refer for that*///
    let date = new Date(singleDay.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    //console.log("here is the hourrs weather", hours);
    if (hours === 12) {
      //* we select the time 12, and push that object to disply_days arraya //
      display_days.push(singleDay);
      //console.log(singleDay);
    }
  });
  console.log("array", display_days);
  forcast_display(display_days);
}

//! -------------------------End  forcast fuction ---------------------------------------------------------------------- //

//! ------------------------show  forcast data fuction ---------------------------------------------------------------------- //
function forcast_display(display_days) {
  //? we delete all text, pic inside the <div id="days_weather"> //
  forcast_weather.innerHTML = " ";
  display_days.forEach((oneDay) => {
    let getDay = dayOfWeek(oneDay.dt * 1000);
    let tempreatur_inCelcius = Math.round(
      parseFloat(oneDay.main.temp) - 273.15
    );

    let url_image =
      "http://openweathermap.org/img/w/" + oneDay.weather[0].icon + ".png";
    // * now we want to add this varibels to our  app //
    let display_forcast_data = `
  <article class="day_one">
        <img src="${url_image}" alt="${oneDay.weather[0].description} "  id="forcast_day_image">
        <p class="forcast_day">${getDay}</p>
        <p class="forcast_tempretur">${tempreatur_inCelcius} <span class="value">  °C </span> </p>
      </article>`;

    //* https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML // https

    forcast_weather.insertAdjacentHTML("beforeend", display_forcast_data);
  });
}

//! ------------------------End show forcast data fuction ---------------------------------------------------------------------- /
