$(document).ready(function () {
    //Make Search Button reactive
    //Make localStorage to store typed datas
    //Use $.ajax to derive information from openweather webpage with your own api keys
    //Make your searched cities' temperature, humidity, windspeed, and UV index to show up on right side of the webpage.
    //Make 5-Day Forecast to show up at the bottom right-side.
    //Search Button
    $("#search-button").on("click", function(event) {
        var inputCity = $("#search-list").val();
        $("#search-bar").val("");
        searchCity(inputCity);
    });
    //API key and url
    var apiKey = "366ea93a291baf148a642f8cd8243771";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&apiid=" + apiKey;
    
    //Search History
    var searchList = JSON.parse(localStorage.getItem("searchList")) || [];
    if (searchList.length > 0) {
        weatherFunction(searchList[searchList.length - 1]);
    }
    for (var i = 0; i < searchList.length; i++) {
        var listEl = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(queryURL);
            console.log(response);

            var cityName = $("<h1>").text(response.name);
            var cityTemp = $(".temp").text("Temperature: " + response.main.temp + "°F")
            var cityWind = $(".wind").text("Wind speed: " + response.main.speed + "MPH");
            var cityHumid = $(."humid").text("Humidity: " + response.main.humidity + "%");


        });
    } 
});