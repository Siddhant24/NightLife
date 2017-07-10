'use strict';

(function(){
    
    var search = document.getElementById("search");
    var list = document.getElementById("list");
    var latitude = 29.235006, longitude = 75.707928;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition  (function(position) {
         //   latitude = position.coords.latitude;
           // longitude = position.coords.longitude;
        }, function error(msg){alert('Please enable your GPS position future.');}, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
    }
    else{
        console.log("Navigator is not supported");
    }
    ajaxFunctions.ready(function(){
        search.addEventListener('click',function(){
            ajaxFunctions.ajaxPostRequest({latitude: latitude, longitude: longitude}, appUrl + '/search', function(data){
                console.log(data);
                JSON.parse(data).results.forEach(function(place){
                    var li = document.createElement("li");
                    var img = document.createElement("img");
                    li.append(img);
                    img.setAttribute("src", `${place.icon}`);
                    img.setAttribute("style", "display:inline-block;");
                    li.innerHTML += '<h3 class="text-primary" style="display:inline-block;">' + place.name + '</h3><br><h6 class="text-success">Address: ' + place.vicinity + '</h6><br><br><hr><br><br>';
                    list.append(li);
                })
         });
        });
    });
})();