
var geocoder;
var map;
var marker;
var lat;
var long;

var interestedPlaces = [];

//variable declaration for use throughout the page
var info = document.getElementById('directions-btn');
var directions = document.getElementById('directions');
var card = document.getElementById('card');
var close = document.getElementById('close');
var skip = document.getElementById('skip');

//information click events for the directions on the homepage
info.addEventListener('click', information);
close.addEventListener('click', closeDirections);

//function to display the information block
function information(){
    directions.style.display = 'block';
    console.log('clicked');
    info.style.display = 'none';
};

//function to close the directions box
function closeDirections(){
    directions.style.display = 'none';
    info.style.display = 'block';
};


//function to initialize the geolocation and autocomplete features with Google API
$(document).ready(function () {
    //load google map
    initialize();
    
    /*
     * autocomplete location search, pulling the address from the location field on teh homepage
     */
    var PostCodeid = '#search_location';
    $(function () {
        $(PostCodeid).autocomplete({
            source: function (request, response) {
                geocoder.geocode({
                    'address': request.term
                }, function (results, status) {
                    response($.map(results, function (item) {
                        return {
                            //return the origin latitude and longitude, later used to find points of interest associated with that address
                            label: item.formatted_address,
                            value: item.formatted_address,
                            lat: item.geometry.location.lat(),
                            lon: item.geometry.location.lng()
                        };
                    }));
                });
            },
            select: function (event, ui) {
                $('.search_addr').val(ui.item.value);
                $('.search_latitude').val(ui.item.lat);
                lat = (ui.item.lat);
                console.log(lat);
                $('.search_longitude').val(ui.item.lon);
                long = (ui.item.lon);
                console.log(long);
                //sets the latitude and longitude, creates a marker on the map and calls the initialize function to pull locations based on the location
                var latlng = new google.maps.LatLng(ui.item.lat, ui.item.lon);
                marker.setPosition(latlng);
                initialize();
                //closes the location search bar once a location is set. This is necessary to make this feel like a single-page app
                closeA();
            }
        });
    });
});
    
    /*
     * Point location on google map
     */
    $('.get_map').click(function (e) {
        var address = $(PostCodeid).val();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                $('.search_addr').val(results[0].formatted_address);
                $('.search_latitude').val(marker.getPosition().lat());
                $('.search_longitude').val(marker.getPosition().lng());
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
        e.preventDefault();
    });

    // Add listener to marker for reverse geocoding
    google.map.event.addListener(marker, 'drag', function () {
        geocoder.geocode({'latLng': marker.getPosition()}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $('.search_addr').val(results[0].formatted_address);
                    $('.search_latitude').val(marker.getPosition().lat());
                    $('.search_longitude').val(marker.getPosition().lng());
                 
                }
            }
        });
    });



//called when a user inputs their location and the geocoding works as intended
function closeA() {
    //closes the location input container
    document.getElementById('one').style.display = "none";
    //displays the reccommendations section
    document.getElementById('two').style.display = "block";
    //closes the subhead below the logo
    document.getElementById('sub').style.display = "none";
    //sets the logo size smaller for better legibility on the page
    document.getElementById('logo').style.fontSize = "8vw";
    document.getElementById('directions').style.display = "none";
    info.style.display = 'none';
}

function closeB() {
    //closes the reccomendations section
    document.getElementById('two').style.display = 'none';
    //opens the favorites list and displays the map
    document.getElementById('three').style.display = 'grid';
    document.getElementById('logo').style.fontSize = "5vw";

}


//main function of the app that dynamically returns restaurants one-by-one, creates new pins on a map for selected restaurants and creates the map
function initialize() {
    var initialLat = $('.search_latitude').val();
    var initialLong = $('.search_longitude').val();


    var latlng = new google.maps.LatLng(initialLat, initialLong);
    //parameters necessary for google to create the map
    var options = {
        //the lower the zoom, the further out it is set. 20 is the highest you can set this, which zooms to the building level
        zoom: 14,
        //centers the map around the users' location
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("geomap"), options);

                    //pulls the places information based on the location, radius and type
                    infowindow = new google.maps.InfoWindow();
                        var service = new google.maps.places.PlacesService(map);
                        service.nearbySearch({
                          location: latlng,
                          radius: 3800,                          
                          type: ['bar']
                          
                        }, callback);
                      

                    //function that pulls the information from the Places request and dynamically creates the tinder-like cards for restaurants
                    function callback(results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            var counter = 0;
                            createMarker(results[counter]);
                                
                            //creates cards based on the results of the search
                            function createCard(){
                                var picture = document.getElementById('picture');
                                    picture.style.backgroundImage = 'url(' +results[counter].icon+')';
                                var name = document.getElementById('name');                                    
                                    name.innerHTML = results[counter].name;
                                var rating = document.getElementById('rating');
                                    rating.innerHTML = "Rating: " + results[counter].rating + " out of 5";
                                var price = document.getElementById('price');
                                    // price.innerHTML = '"$" * parseInt(results[counter].price_level)' ;
                                    if(results[counter].price_level == 1){
                                        price.innerHTML =  "Price: "+"$";
                                    }else if(results[counter].price_level == 2){
                                        price.innerHTML =  "Price: "+"$$";
                                    }else if(results[counter].price_level == 3) {
                                        price.innerHTML = "Price: "+"$$$"
                                    }else {
                                        price.innerHTML = "Price: "+"$$$$"
                                    }
                                var address = document.getElementById('address');
                                    address.innerHTML = results[counter].vicinity;
                                
                                var like = document.getElementById('like');
                                    like.style.width = "7vw";
                                    like.style.height = "9vh";
                                    like.style.display = "inline-block";
                                    like.style.margin = "0 auto";
                                    like.style.color = "white";
                                    like.style.cursor = "pointer";
                                    like.style.lineHeight = '9vh';
                                    like.style.gridColumn = "2/3";
                                    like.style.animation = 'shadow-pulse 1.5s 0.5s 4';
                                    like.style.border = '1px solid';
                                    like.style.borderRadius = "50%";
                                    like.style.backgroundImage = 'url("https://cdn3.iconfinder.com/data/icons/social-productivity-black-line-2/1/37-512.png")';
                                    like.style.backgroundSize = '80% 80%';
                                    like.style.backgroundColor = "rgba(2,173,83,0.7)";
                                    like.style.backgroundRepeat = "no-repeat";
                                    like.style.backgroundPosition = "center";
                                    //if statement is for mobile responsive
                                    if (window.matchMedia("(max-width: 575px)").matches) {
                                        like.style.width = "12vw"
                                    } else {
                                        like.style.width = "7vw"
                                    };
                                var dislike = document.getElementById('dislike');
                                    dislike.style.width = "7vw";
                                    dislike.style.height = "9vh";
                                    dislike.style.gridColumn = "1/2";
                                    dislike.style.animation = 'shadow-pulse 1.5s 0.5s 4';
                                    dislike.style.color = "white";
                                    dislike.style.cursor = "pointer";
                                    dislike.style.lineHeight = '9vh';
                                    dislike.style.borderRadius = "50%";
                                    dislike.style.display = "inline-block";
                                    dislike.style.margin = "0 auto";                                    
                                    dislike.style.border = '1px solid';
                                    dislike.style.backgroundImage = 'url("https://cdn4.iconfinder.com/data/icons/like-18/32/460-01-512.png")';
                                    dislike.style.backgroundSize = '70% 70%';
                                    dislike.style.backgroundColor = "rgba(117,11,13,0.7)";
                                    dislike.style.backgroundRepeat = "no-repeat";
                                    dislike.style.backgroundPosition = "center";
                                    //if statement is for mobile responsive
                                    if (window.matchMedia("(max-width: 575px)").matches) {
                                        dislike.style.width = "12vw"
                                    } else {
                                        dislike.style.width = "7vw"
                                    };
                                //closes create

                                }
                                    createCard();
                                    document.getElementById('like').addEventListener( 'click', upvote);
                                    document.getElementById('dislike').addEventListener( 'click', downvote);
                                        
                                    //function called when users 'like' a restaurant
                                    function upvote(){
                                        //pushes 'liked' restaurant into array for later use
                                        interestedPlaces.push(results[counter]);
                                        callback(results[counter]);
                                        createMarker(results[counter]);
                                        //updates the counter so that we can display the skip ahead button when appropriate
                                        counter += 1;
                                        //creates the card with the next result
                                        createCard(results[counter]);
                
                                    //creates a marker on the map with the location of the 'liked' restaurant
                                       function createNewMarker(result){
                                            marker = new google.maps.Marker({
                                                map: map,
                                                position: result[counter].geometry.location
                                            })                                            
                                        };
                                        console.log(interestedPlaces);
                                        console.log(counter);
                                        //if statement displays the 'skip ahead' button for users who do not want to click through each result
                                        if (counter >= 7){
                                        skip.style.display = 'block'
                                        };
                                        //if statement that will display the results when you get to the penultimate result
                                        if (counter == (results.length-1)){
                                                showRec();
                                        };
                                    }

                                    //function that called when the 'dislike' button is clicked
                                    function downvote(){
                                        counter += 1;                                        
                                        callback(results[counter]);
                                        createCard(results[counter]);
                                        //if statement displays the 'skip ahead' button for users who do not want to click through each result
                                        console.log('hello')
                                        // removeDislike();
                                        if (counter >= 7){
                                        skip.style.display = 'block'
                                        };
                                        //if statement that will display the results when you get to the penultimate result
                                        if (counter == (results.length-1)){
                                                showRec();
                                        };
                                    }
                                    
                                    function showRec(){
                                        recommendations();
                                                closeB();
                                    };
                                    skip.addEventListener( 'click', showRec);


                                    //called above when the user either clicks the 'skip ahead' button or reaches the end of the API result list
                                    //this function dynamically creates the full list of places that were liked by a user
                                    function recommendations(){
                                        for (var i = 0; i < interestedPlaces.length; i++) {
                                        var card = document.createElement('div');
                                        card.id = "reccoCard";
                                        card.style.width = "25vw";                                        
                                        card.style.height = "33vh";                                        
                                        card.style.display = "inline-block";
                                        card.style.margin = "20px";
                                        card.style.border = "1px solid white";
                                        card.style.borderRadius = '5px';
                                        card.style.textAlign = 'center';
//                                         card.style.overflow = 'scroll';
                                        card.style.backgroundColor = "rgba(241,240,238,0.8)";
                                        card.style.boxShadow = "0 48px 76px rgba(0,0,0,0.30), 0 30px 24px rgba(0,0,0,0.22)";
                                        document.getElementById('interestedPlaces').appendChild(card);
                                        //if statement for mobile responsive
                                        if (window.matchMedia("(max-width: 575px)").matches) {
                                          card.style.width = '97%';
                                          card.style.maxHeight = "100px";
                                          card.style.display = "grid";
                                          card.style.gridTemplateColumns = "2fr 1fr 1fr 1fr 2fr";
                                          card.style.margin = "9px auto";
                                        } else {
                                          card.style.width = '25vw'
                                        }
                                            var name = document.createElement('div');
                                            name.id = "reccoName";
                                            name.style.width = "98%";                                            
                                            name.style.margin = "25px auto";
                                            name.style.color = '#707070';
                                            // name.style.border = "1px solid white";
                                            name.style.textAlign = "center";
                                            name.style.fontSize = "1.75em";
                                            name.style.fontFamily = "'Lato', sans-serif";
                                            name.innerHTML = interestedPlaces[i].name;
                                            document.getElementById('line').appendChild(name);
                                            //if statement for mobile responsive
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              name.style.fontSize = '1.2em'
                                              name.style.gridColumn = "1/2"
                                              name.style.width = "90%";
                                              name.style.margin = "5% 2%";
                                              name.style.display = "flex";
                                              name.style.alignItems = "center";
                                              name.style.justifyContent = "center";
                                              name.style.flexDirection = "column";
                                              name.style.textAlign = "center";                                              
                                            } else {
                                              name.style.fontSize = '1.75em'
                                            }
                                            card.appendChild(name);
                                            var rating = document.createElement('div');
                                            rating.id = "reccoRating";
                                            rating.style.width = "70%";
                                            rating.style.color = '#015073';                                            
                                            rating.style.margin = "10px auto";
                                            // rating.style.border = "1px solid";
                                            rating.style.textAlign = "center";
                                            rating.style.fontSize = '1.2em';
                                            rating.style.fontFamily = "'Lato', sans-serif";
                                            rating.innerHTML = "Rating: " + interestedPlaces[i].rating + " out of 5";
                                            card.appendChild(rating);
                                            //if statement for mobile responsive
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              rating.style.fontSize = '0.80em';
                                              rating.style.gridColumn = "2/3";
                                              rating.style.width = "90%";
                                              rating.style.margin = "5% 0";
                                              rating.style.display = "flex";
                                              rating.style.alignItems = "center";
                                              rating.style.justifyContent = "center";
                                              rating.style.flexDirection = "column";
                                              rating.style.textAlign = "center";
                                            } else {
                                              rating.style.fontSize = '1.2em'
                                            }
                                            var price = document.createElement('div');
                                            price.id = 'reccoPrice';
                                            price.style.width = "70%";
                                            price.style.color = '#015073';                                            
                                            price.style.margin = "10px auto";
                                            // price.style.border = "1px solid";
                                            price.style.textAlign = "center";
                                            price.style.fontSize = '1.2em';
                                            price.style.fontFamily = "'Lato', sans-serif";
                                            if(interestedPlaces[i].price_level == 1){
                                                price.innerHTML =  "Price: "+"$";
                                                }else if(interestedPlaces[i].price_level == 2){
                                                    price.innerHTML = "Price: "+ "$$";
                                                }else if (interestedPlaces[i].price_level == 3){
                                                    price.innerHTML = "Price: "+"$$$";
                                                } else {
                                                    price.innerHTML = "Price: "+"$$$$";
                                                }
                                            card.appendChild(price);
                                            //if statement for mobile responsive
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              price.style.fontSize = '0.85em';
                                              price.style.gridColumn = "3/4"
                                              price.style.width = "90%";
                                              price.style.margin = "5% 0";
                                              price.style.display = "flex";
                                              price.style.alignItems = "center";
                                              price.style.justifyContent = "center";
                                              price.style.flexDirection = "column";
                                              price.style.textAlign = "center";
                                                } else {
                                                    price.style.fontSize = '1.2em'
                                            }
                                            var open = document.createElement('div');
                                            open.id = 'reccoOpen';
                                            open.style.width = "70%";                                  
                                            open.style.margin = "10px auto";
                                            // open.style.border = "1px solid";
                                            open.style.textAlign = "center";
                                            open.style.fontSize = '1.2em';
                                            open.style.fontFamily = "'Lato', sans-serif";
                                            if (interestedPlaces[i].opening_hours == null){
                                                open.innerHTML = "No hours listed";
                                            } else if (interestedPlaces[i].opening_hours.open_now == true){
                                                open.style.color = "green"
                                                open.innerHTML =  "Open";
                                            }else {
                                                open.style.color = "red"
                                                open.innerHTML =  "Closed";
                                            }
                                            card.appendChild(open);
                                            //if statement for mobile responsive
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              open.style.fontSize = '0.85em'
                                              open.style.gridColumn = "4/5"
                                              open.style.width = "90%";
                                              open.style.margin = "5% 0";
                                              open.style.display = "flex";
                                              open.style.alignItems = "center";
                                              open.style.justifyContent = "center";
                                              open.style.flexDirection = "column";
                                              open.style.textAlign = "center";
                                            } else {
                                              open.style.fontSize = '1.2em'
                                            }
                                            var directions = document.createElement('div');
                                            directions.id = 'reccoDirections';
                                            directions.style.width = "3vw";
                                            directions.style.color = 'white';
                                            directions.style.backgroundColor = '#015073';
                                            directions.style.margin = "10px auto";
                                            directions.style.border = "1px solid";
                                            directions.style.padding = "8px";
                                            directions.style.borderRadius = "26px";
                                            directions.style.textAlign = "center";
                                            directions.style.fontSize = '1.3em';
                                            directions.style.fontFamily = "'Lato', sans-serif";
                                            //directions link is created dynamically to direct from users origin to specific destination                                                                           
                                            directions.innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&origin='+lat+","+long+"&destination="+interestedPlaces[i].geometry.viewport.da.g+","+interestedPlaces[i].geometry.viewport.ha.g+"&destination_place_id="+interestedPlaces[i].place_id+'" style="text-decoration:none; color:white">Directions</a>';
                                            card.appendChild(directions);
                                            //if statement for mobile responsive
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              directions.style.width = "55%";
                                              directions.style.fontSize = '0.8em';
                                              directions.style.gridColumn = "5/6";
                                              directions.style.display = "flex";
                                              directions.style.alignItems = "center";
                                              directions.style.justifyContent = "center";
                                              directions.style.margin = "30% 0 0 15%";
                                              directions.style.flexDirection = "column";
                                              directions.style.textAlign = "center";
                                              directions.style.height = "20px";
                                            } else {
                                              directions.style.fontSize = '1.3em'
                                              directions.style.width = "50%";
                                            }
                                        }                                    
                                    }
                          }
                        console.log(results)
                        

                      


                      function createMarker(results) {
                        var placeLoc = results.geometry.location;
                        var marker = new google.maps.Marker({
                          map: map,
                          position: results.geometry.location
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                          infowindow.setContent(results.name);
                          infowindow.open(map, this);
                        });
                      }
              }
    
    //creates a new marker that is draggable when users first input their location
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: latlng
    });

    google.maps.event.addListener(marker, "dragend", function () {
        var point = marker.getPosition();
        map.panTo(point);
        geocoder.geocode({'latLng': marker.getPosition()}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                $('.search_addr').val(results[0].formatted_address);
                $('.search_latitude').val(marker.getPosition().lat());
                $('.search_longitude').val(marker.getPosition().lng());
            }
        });
    });
    geocoder = new google.maps.Geocoder();
}


//function for the tinder-like animation when users click the thumbs-up button
   function liked(){
    // console.log("current status " + card.className)
    if (card.className == 'default'){
        card.className = 'but-yay'
        setTimeout(function(){
            card.className = 'default' 
        }, 500)
    } else if (card.className == 'but-nope'){
        card.className = 'but-yay'
        setTimeout(function(){
            card.className = 'default' 
        }, 500)
    } else {
        card.className = 'but-yay'
        console.log(card.className)
    }
  };

//function for the tinder-like animation when users click the thumbs-down button
  function disliked(){
    if (card.className == 'default'){
        card.className = 'but-nope';
        setTimeout(function(){
            card.className = 'default' 
        }, 500)
    }else {
        card.className = 'default'
    } 
  };
