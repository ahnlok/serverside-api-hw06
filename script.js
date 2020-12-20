$(document).ready(function () {
    //Search button
    $("#searchButton").on("click", function() {
        var search = $("#searchBar").val();
        $("#searchBar").val("");
        weatherFunction(search);
        weatherForecast(search);
    });
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

