$(document).ready(function () {
    //Search button
    $("#searchButton").on("click", function() {
        var search = $("#searchBar").val();
        $("#searchBar").val("");
        weatherFunction(search);
        weatherForecast(search);
    });

    //localStorage
    var previousSearch = JSON.parse(localStorage.getItem("previousSearch"))

        if (previousSearch.length > 0) {
            weatherFunction(previousSearch[previousSearch.length - 1]);
        }
        for(var i = 0; i < previousSearch.length; i++) {
            createRow(previousSearch[i]);
        }
        
        function createRow(element) {
        var list = $("<li>").addClass("search-list").text(element);
        $(".previousSearch").append(list);
        }
        //listener item on click functionality
        $(".previousSearch").on("click", "li", function () {
            weatherFunction($(this).text());
            weatherForecast($(this).text());
        });

    function weatherFunction(search) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&apiid=7d7313c14ed6d928035156118057ac1e&units=imperial"
        //ajax
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            if (previousSearch.indexOf(search) === -1) {
                previousSearch.push(search);
                localStorage.setItem("previousSearch", JSON.stringify(previousSearch));
                createRow(search);
            }
            //empty() to clear previous content
            $("#today-cast").empty(); 

            var title = $("<h1>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var image = $("<img>").attr("src" + "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var windSpeed = $("<p>").addClass("card-text").text("Current wind speed is: " + data.wind.speed + " MPH");
            var humidity = $("<p>").addClass("card-text").text("Current humidity is: " + data.main.humidity + "%");
            var temperature = $("<p>").addClass("card-text").text("Current temperature is: " + data.main.temp + "°F");
                
            var longitude = data.coord.lon;
            var latitude = data.coord.lat;
        
            var newUrl =  "https://api.openweathermap.org/data/2.5/uvi?appid=7d7313c14ed6d928035156118057ac1e&lat=" + lat + "&lon=" + lon,

            $.ajax({
                url: newUrl,
                method: "GET"
            }).then(function (latlon) {
            console.log(latlon);

                var uvColor;
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index is: ");
                var uvBtn = $("<span>").addClass("btn btn-sm").text(uvResponse);
                    
                if (uvResponse < 3) {
                    uvBtn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    uvBtn.addClass("btn-warning");
                } else {
                    uvBtn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today-cast .card-body").append(uvIndex.append(btn));
                
            });
            title.append(image);
            cardBody.append(title, temperature, windSpeed, humidity);
            card.append(cardBody);
            $("today-cast").append(card);

        });
    }
    function weatherForecast(search) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&apiid=7d7313c14ed6d928035156118057ac1e&units=imperial",
            method: "GET"
        }).then(function(data) {
            
        }
    }
});
