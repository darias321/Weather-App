$(document).ready(function () {
  var userInput = "";
  var apiKey = "c19859ebb61ccce6f0cbf52c315b53a3";
  var cityName = "";
  $("#day").html(moment().format("MMM DD, YYYY"));

  $("#submitBtn").on("click", function (event) {
    event.preventDefault();
    userInput = $("#userInput").val();

    var cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (cities.indexOf(userInput) === -1) {
      cities.push(userInput);
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    $("#cities").html("");
    for (var i = 0; i < cities.length; i++) {
      $("#cities").append(`
      <li class="list-group-item">${cities[i]}</li>  
      `);
      $("li").click(function (event) {
        $("input").val($(this).text());
        $("#submitBtn").click();
      });
    }

    $("#userInput").val("");

    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=c19859ebb61ccce6f0cbf52c315b53a3&units=imperial`,
      dataType: "json",
    }).then(function (response) {
      console.log(response);

      document.getElementById("main").innerHTML = "";

      var cityName = response.name;

      console.log("Humidity", response.main.humidity);
      console.log("Temperature:", response.main.temp);
      console.log("Pressure:", response.main.pressure);

      $("#main").append(`
      <div>
          <h1>${cityName}</h1>
          <p>Temperature: ${response.main.temp} F</p>
          <p>Pressure: ${response.main.pressure}</p>
          <p>Humidity: ${response.main.humidity}</p>
          <img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" />
        </div>
        `);
      $.ajax({
        type: "GET",
        url: `http://api.openweathermap.org/data/2.5/uvi?appid=c19859ebb61ccce6f0cbf52c315b53a3&lat=${response.coord.lat}&lon=${response.coord.lon}`,
      }).then(function (uv) {
        $("#main").append(`<p>UV Index: ${uv.value}</p>`);
      });
    });
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=c19859ebb61ccce6f0cbf52c315b53a3&units=imperial`,
    }).then(function (response) {
      $("#forecast").html("<h3>Forecast</h3>");
      for (var i = 0; i < response.list.length; i += 8) {
        $("#forecast").append(`
          <div class="col-xs-12 col-md-4 col-lg-3">
            <div class="card">
              <div class="card-body"></div>
              <p>Temperature: ${response.list[i].main.temp} F</p>
              <p>Pressure: ${response.list[i].main.pressure}</p>
              <p>Humidity: ${response.list[i].main.humidity}</p>
              <img src="http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png" />
            </div>
          </div>
        `);
      }
    });
  });
});
