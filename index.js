// document.addEventListener('DOMContentLoaded', function() {
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

info.addEventListener('click', information);
close.addEventListener('click', closeDirections);

function information(){
    directions.style.display = 'block';
    console.log('clicked');
    info.style.display = 'none';
};

function closeDirections(){
    directions.style.display = 'none';
    info.style.display = 'block';
};


$(document).ready(function () {
    //load google map
    initialize();
    
    /*
     * autocomplete location search
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
                var latlng = new google.maps.LatLng(ui.item.lat, ui.item.lon);
                marker.setPosition(latlng);
                initialize();
                closeA();
            }
        });
    });
});
    
    //self containg function
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


    //self containing function
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






function closeA() {
    document.getElementById('one').style.display = "none";
    document.getElementById('two').style.display = "block";
    document.getElementById('sub').style.display = "none";
    document.getElementById('logo').style.fontSize = "8vw";
    document.getElementById('directions').style.display = "none";
    info.style.display = 'none';
}

function closeB() {
    document.getElementById('two').style.display = 'none';
    document.getElementById('three').style.display = 'grid';

}





/*
 * Google Map with marker
 */
function initialize() {
    var initialLat = $('.search_latitude').val();
    var initialLong = $('.search_longitude').val();


    var latlng = new google.maps.LatLng(initialLat, initialLong);
    var options = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("geomap"), options);

                     infowindow = new google.maps.InfoWindow();
                        var service = new google.maps.places.PlacesService(map);
                        service.nearbySearch({
                          location: latlng,
                          radius: 3800,                          
                          type: ['bar']
                          
                        }, callback);
                      

                      function callback(results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                          // for (var i = 0; i < results.length; i++) {
                            var counter = 0;
                               
                            createMarker(results[counter]);
                                
                            //creates cards based on the results of the search
                            function createCard(){
                            // var card = document.createElement('div');
                            // card.style.width = "80%";
                            // card.style.height = "120px";
                            // card.style.margin = "0 auto";
                            // card.style.border = "1px solid";
                            // document.getElementById('cards').appendChild(card);
                                
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
                                    
                                    // document.getElementById('like').addEventListener("click", upvote);


                                    // function changeDisplay(){
                                    //     picture.style.backgroundImage = 'url(' +results[counter+1].icon+')';
                                    //     name.innerHTML = results[counter+1].name;
                                    //     rating.innerHTML = results[counter+1].rating + " out of 5";
                                    //     }

                                    console.log(results.length);
                                    function upvote(){
                                        interestedPlaces.push(results[counter]);
                                        
                                        callback(results[counter]);
                                        createMarker(results[counter]);
                                        counter += 1;
                                        createCard(results[counter]);
                                        // removeLike();
                                   // while (counter <= 19) {
                                   //      recommendations();
                                   //      console.log('hey')
                                   //  }; 
                                       function createNewMarker(result){
                                            marker = new google.maps.Marker({
                                                map: map,
                                                position: result[counter].geometry.location
                                            })
                                            console.log(position);
                                        //closes createNewMarker
                                        };
                                        console.log(interestedPlaces);
                                        console.log(counter);
                                        if (counter >= 7){
                                        skip.style.display = 'block'
                                        };
                                        if (counter == (results.length-1)){
                                                showRec();
                                        };

                                    //closes upvote    
                                    }

                                    //self contained
                                    function downvote(){
                                        counter += 1;                                        
                                        callback(results[counter]);
                                        createCard(results[counter]);
                                        console.log('hello')
                                        // removeDislike();
                                        if (counter >= 7){
                                        skip.style.display = 'block'
                                        };
                                        if (counter == (results.length-1)){
                                                showRec();
                                        };
                                    }
                                    
                                    function showRec(){
                                        recommendations();
                                                closeB();
                                    };

                                   
                                    skip.addEventListener( 'click', showRec);

                                    function recommendations(){
                                        for (var i = 0; i < interestedPlaces.length; i++) {
                                        var card = document.createElement('div');
                                        card.id = "reccoCard";
                                        card.style.width = "25vw";                                        
                                        card.style.height = "28vh";                                        
                                        card.style.display = "inline-block";
                                        card.style.margin = "15px";
                                        card.style.border = "1px solid white";
                                        card.style.borderRadius = '5px';
                                        card.style.textAlign = 'center';
                                        card.style.overflow = 'scroll';
                                        card.style.backgroundColor = "rgba(241,240,238,0.8)";
                                        document.getElementById('interestedPlaces').appendChild(card);
                                        if (window.matchMedia("(max-width: 575px)").matches) {
                                          card.style.width = '35vw';
                                          card.style.margin = "8px";
                                        } else {
                                          card.style.width = '25vw'
                                        }
                                            var picture = document.createElement('div');
                                            picture.id = "reccoPicture";
                                            picture.style.width = "30%";
                                            picture.style.margin = "10px auto";
                                            picture.style.height = "30%";
                                            // picture.style.border = "1px solid yellow";
                                            picture.style.backgroundSize = "100% 100%";
                                            picture.style.backgroundImage =  'url(' +interestedPlaces[i].icon+')';
                                            // card.appendChild(picture);
                                            var name = document.createElement('div');
                                            name.id = "reccoName";
                                            name.style.width = "98%";                                            
                                            name.style.margin = "25px auto";
                                            name.style.color = '#F27E1D';
                                            // name.style.border = "1px solid white";
                                            name.style.textAlign = "center";
                                            name.style.fontSize = "1.75em";
                                            name.style.fontFamily = "'Lato', sans-serif";
                                            name.innerHTML = interestedPlaces[i].name;
                                            document.getElementById('line').appendChild(name);
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              name.style.fontSize = '0.85em'
                                            } else {
                                              name.style.fontSize = '1.75em'
                                            }
                                            card.appendChild(name);
                                            var rating = document.createElement('div');
                                            rating.id = "reccoRating";
                                            rating.style.width = "70%";
                                            rating.style.color = 'white';                                            
                                            rating.style.margin = "10px auto";
                                            // rating.style.border = "1px solid";
                                            rating.style.textAlign = "center";
                                            rating.style.fontSize = '1.2em';
                                            rating.style.fontFamily = "'Lato', sans-serif";
                                            rating.innerHTML = "Rating: " + interestedPlaces[i].rating + " out of 5";
                                            card.appendChild(rating);
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              rating.style.fontSize = '0.75em'
                                            } else {
                                              rating.style.fontSize = '1.2em'
                                            }
                                            var price = document.createElement('div');
                                            price.id = 'reccoPrice';
                                            price.style.width = "70%";
                                            price.style.color = 'white';                                            
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
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              price.style.fontSize = '0.75em'
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
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              open.style.fontSize = '0.75em'
                                            } else {
                                              open.style.fontSize = '1.2em'
                                            }
                                            var directions = document.createElement('div');
                                            directions.id = 'reccoDirections';
                                            directions.style.width = "50%";
                                            directions.style.color = 'white';
                                            directions.style.backgroundColor = '#04C3D9';
                                            directions.style.margin = "10px auto";
                                            directions.style.border = "1px solid";
                                            directions.style.padding = "15px";
                                            directions.style.borderRadius = "5px";
                                            directions.style.textAlign = "center";
                                            directions.style.fontSize = '1.3em';
                                            directions.style.fontFamily = "'Lato', sans-serif";
                                            directions.innerHTML = '<a href="https://www.google.com/maps/dir/?api=1&origin='+lat+","+long+"&destination="+interestedPlaces[i].geometry.viewport.ma.j+","+interestedPlaces[i].geometry.viewport.fa.j+"&destination_place_id="+interestedPlaces[i].place_id+'">Get Directions</a>';
                                            directions.style.textDecoration = 'none';
                                            card.appendChild(directions);
                                            if (window.matchMedia("(max-width: 575px)").matches) {
                                              directions.style.width = "40%";
                                              directions.style.fontSize = '0.8em'
                                            } else {
                                              directions.style.fontSize = '1.3em'
                                              directions.style.width = "50%";
                                            }
                                            
                                        //closes for loop
                                        }
                                    //closes reccomendations
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
                      //no match after
                  
              }
    
//self contained
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: latlng
    });
//self contained
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
//no match
}
//no open

// });




   function liked(){
    console.log("current status " + card.className)
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

  }

  function disliked(){
    if (card.className == 'default'){
        card.className = 'but-nope';
        setTimeout(function(){
            card.className = 'default' 
        }, 500)
    }else {
        card.className = 'default'
    }
    
  }




//old code for map features


// //get places
//  var map;
//  var infowindow;

//       function initMap() {
//         var pyrmont = {lat: 39.9525839, lng: -75.16522150000003};

//         map = new google.maps.Map(document.getElementById('map'), {
//           center: pyrmont,
//           zoom: 15
//         });

//         infowindow = new google.maps.InfoWindow();
//         var service = new google.maps.places.PlacesService(map);
//         service.nearbySearch({
//           location: pyrmont,
//           radius: 500,
//           type: ['store']
//         }, callback);
//       }

//       function callback(results, status) {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//           for (var i = 0; i < results.length; i++) {
//             createMarker(results[i]);
//           }
//         }
//       }

//       function createMarker(place) {
//         var placeLoc = place.geometry.location;
//         var marker = new google.maps.Marker({
//           map: map,
//           position: place.geometry.location
//         });

//         google.maps.event.addListener(marker, 'click', function() {
//           infowindow.setContent(place.name);
//           infowindow.open(map, this);
//         });
//       }
