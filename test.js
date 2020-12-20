$(document).ready(function () {
    //Search Button
    $("#search-button").on("click", function() {
        var searchTerm = $("#search-list").val();
        $("#search-bar").val("");
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });
    //Search History
    var searchList = JSON.parse(localStorage.getItem("searchList")) || [];
    if (searchList.length > 0) {
        weatherFunction(searchList[searchList.length - 1]);
    }
    for (var i = 0; i < searchList.length; i++) {
        createRow(searchList[i]);
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

    function weatherFunction(searchTerm){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=366ea93a291baf148a642f8cd8243771&units=imperial&";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(data) {
            // console.log(queryURL);
            // console.log(data);

            if(history.indexOf(searchTerm) === -1) {
                history.push(searchTerm);
                localStorage.setItem("history", JSON.stringify(history));
                createRow(searchTerm);
            }
            //To clear out previous search lists
            $("#today-cast").empty(); 

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var cityTemp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + "°F")
            var cityWind = $("<p>").addClass("card-text").text("Wind speed: " + response.main.speed + "MPH");
            var cityHumid = $("<p>").addClass.text("Humidity: " + response.main.humidity + "%");

            //Getting data for uvindex
            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=366ea93a291baf148a642f8cd8243771&lat=" + lat + "&lon=" + lon,
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
                $("#today .card-body").append(uvIndex.append(btn));
            });
            //Adding image to each section
            title.append(img);
            cardBody.append(title, cityTemp, cityHumid, cityWind);
            card.append(cardBody);
            $("#today").append(card);
        });
    }
    //Function for 5 Days-Forecast
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + 
            "$appid=366ea93a291baf148a642f8cd8243771&units=imperial"
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
                    var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].main.speed + "MPH");

                    colFive.Five.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive, windFive)));
                    $("#forecast .row").append(colFive);
                }
            }
        });
    }
});