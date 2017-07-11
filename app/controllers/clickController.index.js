'use strict';

(function(){
    
    var search = document.getElementById("search");
    var list = document.getElementById("list");
    var userInfo = document.querySelector(".user-info");
    var latitude , longitude ;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition  (function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        }, function error(msg){alert('Please enable your GPS position future.');}, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
    }
    else{
        console.log("Navigator is not supported");
    }
    
    function updateGoing(){
        ajaxFunctions.ajaxRequest('GET', appUrl + '/going', function(data){
            var newData = JSON.parse(data);
            newData.forEach(function(user){
                user.bars.forEach(function(bar){
                    var goingBtn = document.getElementById(`${bar}`);
                    if(goingBtn){
                        var num = (Number(goingBtn.innerText.slice(0,1))+1).toString();
                        goingBtn.innerText = num + " going";
                    }
                });
            });
        });
    }
    
    ajaxFunctions.ready(function(){
        var promise = new Promise(function(resolve, reject){
                ajaxFunctions.ajaxRequest('GET', appUrl + '/authenticated', function(data){
                    resolve(data);
                });
            });
            
        promise.then(function(data){
            var isAuthenticated = JSON.parse(data);
            if(isAuthenticated){
                var p1 = document.createElement("p");
                p1.innerHTML = 'Welcome, <span id="display-name"></span>!';
                userInfo.append(p1);
                var a = document.createElement("a");
                a.setAttribute("class", "menu");
                a.setAttribute("href", "/profile");
                a.innerHTML = "Profile";
                userInfo.append(a);
                var p2 = document.createElement("p");
                p2.innerHTML = "|";
                userInfo.append(p2);
                var a2 = document.createElement("a");
                a2.setAttribute("class", "menu");
                a2.setAttribute("href", "/logout");
                a2.innerHTML ="Logout";
                userInfo.append(a2);
                var profileId = document.querySelector('#profile-id') || null;
                var profileUsername = document.querySelector('#profile-username') || null;
                var profileRepos = document.querySelector('#profile-repos') || null;
                var displayName = document.querySelector('#display-name');
                var apiUrl = appUrl + '/api/:id';
                function updateHtmlElement (data, element, userProperty) {
                    element.innerHTML = data[userProperty];
                }

                ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
                    var userObject = JSON.parse(data);

                    if (userObject.displayName !== null) {
                        updateHtmlElement(userObject, displayName, 'displayName');
                    } else {
                        updateHtmlElement(userObject, displayName, 'username');
                    }

                    if (profileId !== null) {
                        updateHtmlElement(userObject, profileId, 'id');   
                    }

                    if (profileUsername !== null) {
                        updateHtmlElement(userObject, profileUsername, 'username');   
                    }

                    if (profileRepos !== null) {
                        updateHtmlElement(userObject, profileRepos, 'publicRepos');   
                    } 

                });
            }
            else{
                var btn = document.createElement("button");
                btn.setAttribute("class", "btn btn-link login");
                btn.innerHTML = '<i class="fa fa-sign-in" aria-hidden="true" style="font-size:48px;"></i>Login';
                userInfo.append(btn);
                btn.addEventListener('click', function(){
                    window.location.href = window.location.origin + '/login';
                })
            }
            return isAuthenticated;
        }).then(function(isAuthenticated){
            search.addEventListener('click',function(){
                ajaxFunctions.ajaxPostRequest({latitude: latitude, longitude: longitude}, appUrl + '/search', function(data){
                    var parsedData = JSON.parse(data);
                    window.sessionStorage.setItem('searched', JSON.stringify(true));
                    parsedData.results.forEach(function(place, index){
                        var li = document.createElement("li");
                        var img = document.createElement("img");
                        li.append(img);
                        img.setAttribute("src", `${place.icon}`);
                        img.setAttribute("style", "display:inline-block;");
                        if(isAuthenticated){
                            li.innerHTML += '<h3 class="text-primary" style="display:inline-block;">' + place.name + '</h3><button class="btn btn-primary going" id=\"' + place.id + '\">0 going</button>' + '<br><h6 class="text-success">Address: ' + place.vicinity + '</h6><br><br><hr><br><br>';
                            li.children[2].addEventListener('click', function(e){
                                var id = e.target.getAttribute("id");
                                var myBars = new Promise(function(resolve, reject){
                                    ajaxFunctions.ajaxRequest('GET', appUrl + '/search', function(data){
                                        resolve(JSON.parse(data));
                                    });
                                });
                                myBars.then(function(data){
                                   if(data[0].bars.indexOf(id) === -1){
                                       ajaxFunctions.ajaxPostRequest({bar_id: id}, appUrl + '/going', function(data){
                                            var goingBtn = document.getElementById(`${id}`);
                                            var num = (Number(goingBtn.innerText.slice(0,1))+1).toString();
                                            goingBtn.innerText = num + " going";
                                        });
                                   }
                                    else{
                                        ajaxFunctions.ajaxPostRequest({bar_id: id}, appUrl + '/delete', function(data){
                                            var goingBtn = document.getElementById(`${id}`);
                                            var num = (Number(goingBtn.innerText.slice(0,1))-1).toString();
                                            goingBtn.innerText = num + " going";
                                        });
                                    }
                                });
                            });
                        }
                        else
                            li.innerHTML += '<h3 class="text-primary" style="display:inline-block;">' + place.name + '</h3><br><h6 class="text-success">Address: ' + place.vicinity + '</h6><br><br><hr><br><br>';
                        list.append(li);
                        if(index === parsedData.results.length-1 && isAuthenticated){
                            updateGoing();
                        }
                    });
                });
            });
        }).then(function(){
            if(window.sessionStorage.getItem('searched')){
            search.click();
            }
        });
    });
})();