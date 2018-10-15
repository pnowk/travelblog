//google map functions

//map search
//ini map

var input = document.getElementById('searchLocation');
input.addEventListener('keyup', places);
// input.addEventListener('click', renderMap);
var coords = document.getElementById('coords');


function places() {
    // alert('hello from places');
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));

    //add map
    // var map = new google.maps.Map(document.getElementById('map'), options);

    var searchBox = new google.maps.places.SearchBox(input, {
        bounds: defaultBounds
    });

    searchBox.addListener('places_changed', function() {
        // var options = {
        //     zoom: 5,
        //     center: { lat: 52.54682, lng: 19.70638 }

        // };
        var map = new google.maps.Map(document.getElementById('mapResults'));
        // console.log('places changed');
        // console.log(map.getZoom());
        var places = searchBox.getPlaces();
        // console.log(places);

        if (places.length == 0) {
            return;
        }
        //clear out old markers
        var markers = [];
        markers.forEach(function(marker) {
            markers.setMap(null);
        });
        markers = [];
        // console.log(markers);
        //for each place get the icon name and location


        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log('returned place contains no geometry');
                return;
            }

            // console.log(place.geometry.viewport);

            //create coords elements
            console.log(place.geometry.viewport);
            console.log(place.geometry.location);
            var location = place.geometry.location;
            var locArray = String(location).split(",");
            var l = "{lat: " + locArray[0].replace("(", "") + ", lng:" + locArray[1].replace(")", "") + "}";
            var loc = {
                lat: locArray[0].replace("(", ""),
                lng: locArray[1].replace(")", "")

            }

            //    var lg = parseFloat((place.geometry.viewport.b.f + place.geometry.viewport.b.b) / 2);
            //    var lt = parseFloat((place.geometry.viewport.f.f + place.geometry.viewport.f.b) /2);
            //    console.log(lg);
            //    console.log(lt);
            var latEl = document.createElement('input');
            latEl.setAttribute('name', 'lt', 'type', 'text', 'class', 'form-control');
            //    latEl.appendChild(document.createTextNode(lt));
            latEl.value = loc.lat;
            var lngEl = document.createElement('input');
            lngEl.setAttribute('name', 'lg', 'type', 'text', 'class', 'form-control');
            lngEl.value = loc.lng;
            var locEl = document.createElement('input');
            locEl.setAttribute('name', 'loc', 'type', 'text', 'class', 'form-control');
            locEl.value = l;

            //    lngEl.appendChild(document.createTextNode(lg));
            coords.appendChild(latEl);
            coords.appendChild(lngEl);
            coords.appendChild(locEl);

            // coords.appendChild(document.createTextNode(lt));
            // coords.appendChild(document.createTextNode(lg));
            //    coords.appendChild(el)
            // alert(place.geometry.viewport.b)

            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location

            }));
            bounds.union(place.geometry.viewport);
            // bounds.extend(place.geometry.location);
            // bounds.panToBounds(place.geometry.location);
            // console.log(bounds);

            // console.log(markers);
            // if (place.geometry.viewport) {
            //     bounds.union(place.geometry.location);
            // } else {
            //     bounds.extend(place.geometry.location);
            // }

        });
        // map.setZoom(3);

        map.fitBounds(bounds);

        // map.fitBounds(bounds);

    });
}

//all places map

function initMap() {




    // if(typeof(Storage) !== 'undefined'){
    //     console.log('storage supported');
    //     localStorage.setItem('hello', 12345);
    // console.log(localStorage.getItem('places'));
    // }
    // let Place = require('../models/place');
    // Place.find({}, function(err, places){
    //     if(err){
    //         console.log(err);
    //         return;

    //     }else{
    //         console.log(places);
    //     }
    // });

    // console.log(myPlaces);
    //map options
    // alert('hhelo from map');
    var options = {
        zoom: 3,
        center: { lat: 52.54682, lng: 19.70638 }

    };

    //add map
    var map = new google.maps.Map(document.getElementById('map-places'), options);


    //array of markers
    // var markers = [{
    //         coords: { lat: 52.54682, lng: 19.70638 },
    //         iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    //         content: '<h1> PLock MAZ</h1>'

    //     },
    //     {
    //         coords: { lat: 51.54682, lng: 19.70638 },
    //         content: 'Lodz LDZ'
    //     }
    // ];
    var markers = [];
    var locations = document.getElementsByClassName('places-data');
    console.log(locations);

    for (var i = 0; i < locations.length; i++) {
        // console.log(locations[i]);
        // console.log(locations[i].getAttribute('lat'));
        // console.log(locations[i].getAttribute('squad'));
        // console.log(parseFloat(locations[i].getAttribute('lat')));
        // console.log(parseFloat(locations[i].getAttribute('lng')));
        console.log('position:');
        console.log(locations[i].getAttribute('loc'));
        var marker = {
            coords: {
                lat: parseFloat(locations[i].getAttribute('lat')),
                lng: parseFloat(locations[i].getAttribute('lng'))
            },
            position: locations[i].getAttribute('loc'),
            content: '<h4>' + locations[i].getAttribute('dest') + '</h4><br> hahah',
            iconImage: resolveIconUrl(locations[i].getAttribute('squad'))
        }

        markers.push(marker);
    }

    console.log(markers);

    // console.log(el[1].getAttribute('coords'));

    // init markers
    //add markers
    // var marker = new google.maps.Marker({
    //     position: { lat: 52.54682, lng: 19.70638 },
    //     map: map,
    //     icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'

    // });


    //loop through markers
    for (var i = 0; i < markers.length; i++) {
        addMarker(markers[i]);
    }

    // addMarker({
    //     coords: { lat: 52.54682, lng: 19.70638 },
    //     iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    //     content: '<h1> PLock MAZ</h1>'

    // });

    // addMarker({
    //     coords: { lat: 51.54682, lng: 19.70638 },
    //     content: 'Lodz LDZ'
    // });

    function resolveIconUrl(squadVal) {
        if (squadVal == 2) {
            return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter_withshadow&chld=R|FF0000|0000FF';
            // return '/img/pin-blue.png';
            // return 'https://photos.google.com/u/1/photo/AF1QipOR6y9FFzxB47rBNDArlVaP28966dqTfNIajd-1';
        } else if (squadVal == 1) {
            return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter_withshadow&chld=M|FF0330|0000FF';
            // return '/img/pin-red.png';
            // return 'https://photos.google.com/u/1/photo/AF1QipMnTr-LNTSfdfy_8BOHivzqeYDfIS2kFzvUez2u';
        } else if (squadVal == 0) {
            return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter_withshadow&chld=Ł|FF0220|0000FF';
            // return '/img/pin-green.png';
            // return 'https://photos.google.com/u/1/photo/AF1QipN7a3ZW7Yp5UxFH9-WwYs8IGZQppqJjQY18vBbZ';
        }

    }

    function resolveContent(squadVal) {


        if (squadVal === 2) {
            return 'Razem';
        } else if (squadVal === 1) {
            return 'M sama';
        } else {
            return 'Ł sam';
        }
    }

    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            // icon: props.iconImage

        });

        //check for custom icon
        if (props.iconImage) {
            marker.setIcon(props.iconImage);
        }

        //check content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                // 
                content: props.content
            });

            marker.addListener('click', function() {
                // console.log('hello form info window');
                infoWindow.open(map, marker);
            });


        }
    }
}