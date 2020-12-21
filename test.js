$(document).ready(function () {
    //Search Button
    $("#search-button").on("click", function() {
        var searchTerm = $("#search-bar").val();
        $("#search-bar").val("");
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });
    //Search History
    var history = JSON.parse(localStorage.getItem("history")) || [];
    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }
    //Function to add row after search results
    function createRow(text){
        console.log(text);
        var listEl = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listEl);
    }
    $(".history").on("click", "li", function (){
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });
    window.onload = window.sessionStorage.clear(history); //When refresh the page, refresh all the search results

    function weatherFunction(searchTerm){
    
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=0ee1a87c3651c275861013bac617a620&units=imperial",
            method: "GET"

        }).then(function(data) {
            // console.log(queryURL);
            // console.log(data);

            if(history.indexOf(searchTerm) === -1) {
                history.push(searchTerm);
                sessionStorage.setItem("history", JSON.stringify(history));
                createRow(searchTerm);
            }
            //To clear out previous search lists
            $("#today-cast").empty(); 
            $("#forecast").empty();

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var cityTemp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "°F")
            var cityWind = $("<p>").addClass("card-text").text("Wind speed: " + data.wind.speed + "MPH");
            var cityHumid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");

            //Getting data for uvindex
            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=0ee1a87c3651c275861013bac617a620&lat=" + lat + "&lon=" + lon,
                method: "GET"

            }).then(function(response) {
                // console.log(response);

                var uvColor;
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);

                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                }
                else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                }
                else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today-cast .card-body").append(uvIndex.append(btn));

            });
            //Adding image to each section
            title.append(img);
            cardBody.append(title, cityTemp, cityHumid, cityWind);
            card.append(cardBody);
            $("#today-cast").append(card);
        });
    }
    //Function for 5 Days-Forecast
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + 
            "&appid=0ee1a87c3651c275861013bac617a620&units=imperial",

        }).then(function(data){
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for(var i = 0; i < data.list.length; i++) {
                
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var colFive = $("<div>").addClass("col-md-2");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + "°F");
                    var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].wind.speed + "MPH");

                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive, windFive)));
                    $("#forecast .row").append(colFive);

                }
            }
        });
    }
});