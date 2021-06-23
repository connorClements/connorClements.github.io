let lat;
let lng;
var locationMarker;
var radius;
var border;
var flagIcon;
//var flagMarker = {};
var weatherMarker = {};
var clickedLat;
var clickedLng;
var my_options;
var selected;
var infoModal;
var covidModal;
var travelModal;
var newsModal;
var holidayModal;
var images = [];
var cityLat = [];
var cityLng = [];
var cityMarker = [];
var cityIcon = L.ExtraMarkers.icon({
    icon: 'fa-city',
    markerColor: '#0000FF',
    shape: 'circle',
    prefix: 'fa',
    svg: true
    });
var webcamLat = [];
var webcamLng = [];
var webcamMarker = [];
var webcamIcon = L.ExtraMarkers.icon({
    icon: 'fa-video',
    markerColor: '#FF00FF',
    shape: 'circle',
    prefix: 'fa',
    svg: true
    });
var currentWeather = [];
var weatherIcon = L.ExtraMarkers.icon({
    icon: 'fa-sun',
    markerColor: 'yellow',
    shape: 'circle',
    prefix: 'fa',
    svg: true
    });
var holidayTable = document.getElementById("holidayTable");
var polylineStyle = {
    'fillColor': 'white',
    'weight': 4,
    'opacity': 1,
    'color': 'rgb(39, 155, 155)',
    'fillOpacity': 0.6
};
var airportLat = [];
var airportLng = [];
var airportMarker = [];
var airportIcon = L.ExtraMarkers.icon({
    icon: 'fa-plane',
    markerColor: 'green',
    shape: 'circle',
    prefix: 'fa',
    svg: true
    });
var markers = L.markerClusterGroup();
let date;


// window pre-loader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
}); 

setTimeout(function() {
    $('#welcomeModal').modal('show');
}, 2000);


// function to convert kelvin to celsius
function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
};

// Map is full world by default
var map = L.map('mapDiv').fitWorld();

var blackAndWhite = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var watercolour   = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var regular = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var topo = L.tileLayer('https://c.tile.opentopomap.org/{z}/{x}/{y}.png', {tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
	maxZoom: 12,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    zoomOffset: -1,
    layers: [blackAndWhite, watercolour, regular, topo]
}).addTo(map);

var baseMaps = {
    "Black and white": blackAndWhite,
    "Watercolour": watercolour,
    "Regular": regular,
    "Terrain": terrain,
    "Topographical": topo
};


L.control.layers(baseMaps).addTo(map);


// scale for map
L.control.scale().addTo(map);

// Find current location on map and zoom
map.locate({setView: true, maxZoom: 5});

infoModal = L.easyButton('fa-info', function(){
    $('#countryModal').modal('show');
}).addTo(map);

covidModal = L.easyButton('fa-virus', function(){
    $('#covidModal').modal('show');
}).addTo(map);


travelModal = L.easyButton('far fa-compass', function(){
    $('#travelModal').modal('show');
}).addTo(map);

newsModal = L.easyButton('far fa-newspaper', function(){
    $('#newsModal').modal('show');
}).addTo(map);

holidayModal = L.easyButton('fa-passport', function(){
    $('#holidayModal').modal('show');
}).addTo(map);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// current location
function onLocationFound(e) {

    var currentLat = e.latitude;
    var currentLng = e.longitude;
    var currentCountry;

    $.ajax({
        url: "libs/php/currentWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: currentLat,
            longitude: currentLng
        },

        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                currentCountry = result['list']['sys']['country'];

                //console.log(currentCountry);

                $('#countryCode').val(currentCountry).change();

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });

    
};

map.on('locationfound', onLocationFound);

// Send message if location fails for some reason
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);


// click map anywhere to find out the weather
map.on('click', function(e) {

    clickedLat = e.latlng.lat;
    clickedLng = e.latlng.lng;
    //console.log(clickedLat);
    //console.log(clickedLng);

    $.ajax({
        url: "libs/php/currentWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: clickedLat,
            longitude: clickedLng
        },
        
        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                //console.log(result['list']['name']);

                $('#weatherIcon').html("<img style='width: 80px; height: 80px;' src = 'http://openweathermap.org/img/w/" + result['list']['weather'][0]['icon'] + ".png'></img>");
                $('#currentLoc').html(result['list']['name'] + ", " + result['list']['sys']['country']);
                $('#currentWeather').html((result['list']['weather'][0]['description']).charAt(0).toUpperCase() + (result['list']['weather'][0]['description']).slice(1));
                $('#currentTemp').html("<i class='fas fa-thermometer-three-quarters'></i> " + kelvinToCelsius(result['list']['main']['temp'])  + "&#8451;");
                $('#feelsLikeTemp').html("'Feels like' " + kelvinToCelsius(result['list']['main']['feels_like']) + "&#8451;");
                $('#temp').html("H:" + kelvinToCelsius(result['list']['main']['temp_max'])  + "&#8451; L:" + kelvinToCelsius(result['list']['main']['temp_min']) + "&#8451;");
                $('#windSpeed').html("<i class='fas fa-wind'></i> " + result['list']['wind']['speed'] + " m/s");
                $('#humidity').html("<i class='fas fa-tint'></i> " + result['list']['main']['humidity'] + "%");
                $('#pressure').html("<i class='fas fa-tachometer-alt'></i> " + result['list']['main']['pressure'] + " hPa");



                if (locationMarker != undefined) {
                    map.removeLayer(locationMarker);
                };

                if (weatherMarker != undefined) {
                    map.removeLayer(weatherMarker);
                };

                weatherMarker = L.marker([clickedLat, clickedLng], {icon: weatherIcon}).addTo(map);

                setTimeout(function() {
                    $('#locationModal').modal('show');
                }, 500);
                

            } else {
                $('#noWeatherModal').modal('show');
            }
                
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });

});

// Add countries to select-dropdown menu, add iso2 code as value, put into alphabetical order in dropdown
$.ajax({
    url: "libs/php/isoCountries.php",
    type: 'POST',
    dataType: 'json',
    
    success: function(result) {

        //console.log(result['data']);

        for (i=0; i < result['data'].length; i++) {
            $('#countryCode').append($('<option>', {
                value: result['data'][i]['code'],
                text: `${result['data'][i]['name']}`
            }));
        };
        
        // Put drop down list of options into alphabetical order of country
        my_options = $("#countryCode option");
        selected = $("#countryCode").val();

        my_options.sort(function(a,b) {
            if (a.text > b.text) return 1;
            if (a.text < b.text) return -1;
            return 0;
        });

        $("#countryCode").empty().append(my_options);
        $("#countryCode").val(selected);

    },

    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    }
});

// find country button to search for country on map
$('#countryCode').change(function() {

    for (i = 0; i < 20; i++) {
        if (webcamMarker[i] != undefined) {
            markers.removeLayer(webcamMarker[i]);
            map.removeLayer(webcamMarker[i]);
        };

        if (cityMarker[i] != undefined) {
            markers.removeLayer(cityMarker[i]);
            map.removeLayer(cityMarker[i]);
        };

        if (airportMarker[i] != undefined) {
            markers.removeLayer(airportMarker[i]);
            map.removeLayer(airportMarker[i]);
        };
    };

    $.ajax({
        url: "libs/php/borders.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },

        success: function(result) {
            
            //console.log(result['data']);

            // Find country code which matches country from list
            const newCountry = result['data'].find(country => {
                return country['code'] === $('#countryCode').val();
            });

            //console.log(newCountry.border);

            // Remove any borders on map from previous use
            if(map.hasLayer(border)) {
                map.removeLayer(border);
            };

            // Set border variable to selected geoJSON object
            border = L.geoJSON(newCountry.border, {
                style: polylineStyle
            });

            // add the geoJSON object to the map
            border.addTo(map);

            // zoom to selected country on map
            map.fitBounds(border.getBounds());
        
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
        
    // use country code to populate info in modal pop-up
    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {


                $('#txtCapital').html(result['data'][0]['capital']);
                $('#txtContinent').html(result['data'][0]['continentName']);
                $('#txtPopulation').html(numberWithCommas(result['data'][0]['population']));
                $('#txtCurrencyCode').html(result['data'][0]['currencyCode']);
                $('.txtCountry').html(result['data'][0]['countryName']);
                $('#txtArea').html(numberWithCommas(Math.trunc(result['data'][0]['areaInSqKm'])) + " km&sup2;");
                $('.flagClass').html("<img src = 'https://www.countryflags.io/" + $('#countryCode').val() + "/shiny/64.png'></img>");
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });

    // more country info
    $.ajax({
        url: 'libs/php/getLatLong.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {
                
                lat = result.data.latlng[0];
                lng = result.data.latlng[1];

                $('#txtAltNames').html((result['data']['altSpellings']).join(', '));
                $('#txtTimezone').html((result['data']['timezones']).join(', '));
                $('#txtDemonym').html(result['data']['demonym']);
                $('#txtCurrencyName').html(result['data']['currencies'][0]['name']);
                $('#txtCurrencySymbol').html(result['data']['currencies'][0]['symbol']);

            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    // news for country by country code
    $.ajax({
        url: 'libs/php/news.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                if (!result['data']['articles'][0]) {
                    $('#newsTitle').html('No news available for this country');
                    $('.newsFeed').html(" ");
                } else {
                    $('#newsTitle').html('Breaking News');
                    // add five breaking news stories
                    $('.newsFeed').html("<li><a href='" + result['data']['articles'][0]['url'] + "' target='_blank'>" + result['data']['articles'][0]['title'] + "</a></li>" + 
                    "<li><a href='" + result['data']['articles'][1]['url'] + "' target='_blank'>" + result['data']['articles'][1]['title'] + "</a></li>" + 
                    "<li><a href='" + result['data']['articles'][2]['url'] + "' target='_blank'>" + result['data']['articles'][2]['title'] + "</a></li>" + 
                    "<li><a href='" + result['data']['articles'][3]['url'] + "' target='_blank'>" + result['data']['articles'][3]['title'] + "</a></li>" + 
                    "<li><a href='" + result['data']['articles'][4]['url'] + "' target='_blank'>" + result['data']['articles'][4]['title'] + "</a></li>");
                };

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    // public holidays by country
    $.ajax({
        url: 'libs/php/holidays.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                $('#holidayTable').html("");

                if (result['data']['title'] == 'Not Found') {
                    $('#holidayTitle').html('No local holiday information available');
                } else {
                    $('#holidayTitle').html('Local Holidays');

                    for (i = 0; i < result['data'].length; i++) {
                        function myCreateFunction() {
                            var row = holidayTable.insertRow(i);
                            var holidayName = row.insertCell(0);
                            var holidayDate = row.insertCell(1);
                            date = new Date(result['data'][i]['date']);
                            holidayName.innerHTML = "<span class=holidayName>" + result['data'][i]['name'] + "</span>";
                            holidayDate.innerHTML = "<span class=holidayDate>" + date.toLocaleString(undefined, {weekday: "long", month: "long", day: "numeric"}) + "</span>";
                        };

                    myCreateFunction();
                    };

                };

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    
    

    //console.log($('#countryCode').val());

    // cities by country code
    $.ajax({

        url: 'libs/php/cities.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                //console.log(result['data']['results'].length);

                for (i = 0; i < 20; i++) {
                    images[i] = new Image();
                    images[i].src = result['data']['results'][i]['images'][0]['source_url'];
                    cityLat[i] = result['data']['results'][i]['coordinates']['latitude'];
                    cityLng[i] = result['data']['results'][i]['coordinates']['longitude'];
                    cityMarker[i] = L.marker([cityLat[i], cityLng[i]], {icon: cityIcon})
                                .bindPopup("<p style='text-align: center; font-weight: bold; font-size: 20px;'>" + result['data']['results'][i]['name'] + "</p><p style='text-align: center;'>" + result['data']['results'][i]['snippet'] + "</p><img src='" + result['data']['results'][i]['images'][0]['source_url'] + "' width='100%' height='200'><br>");
                    markers.addLayer(cityMarker[i]);
                };
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    // covid data by country code
    $.ajax({
        url: 'libs/php/covid.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                $('#txtConfirmed').html(numberWithCommas(result['data']['data']['latest_data']['confirmed']));
                $('#txtRecovered').html(numberWithCommas(result['data']['data']['latest_data']['recovered']));
                $('#txtDeaths').html(numberWithCommas(result['data']['data']['latest_data']['deaths']));
                $('#txtDeathRate').html((result['data']['data']['latest_data']['calculated']['death_rate']).toFixed(2) + "%");
                $('#txtCasesPerMillion').html(numberWithCommas(result['data']['data']['latest_data']['calculated']['cases_per_million_population']));
                $('#txtDeathsToday').html(result['data']['data']['today']['deaths']);
                $('#txtConfirmedToday').html(result['data']['data']['today']['confirmed']);

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    // webcam footage markers on the map
    $.ajax({
        url: 'libs/php/webcam.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                for (i = 0; i < 20; i++) {
                    var webcamSrc = [];
                    webcamSrc[i] = result['data']['result']['webcams'][i]['player']['day']['embed'];
                    webcamLat[i] = result['data']['result']['webcams'][i]['location']['latitude'];
                    webcamLng[i] = result['data']['result']['webcams'][i]['location']['longitude'];
                    webcamMarker[i] = L.marker([webcamLat[i], webcamLng[i]], {icon: webcamIcon})
                                .bindPopup("<p style='text-align: center; font-weight: bold; font-size: 20px;'>" + result['data']['result']['webcams'][i]['location']['city'] + "</p>" + "<embed type='video/webm' src=" + result['data']['result']['webcams'][i]['player']['day']['embed'] + " width='200' height='200'>" + "<br>");
                    markers.addLayer(webcamMarker[i]);
                }            
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    $.ajax({
        url: 'libs/php/travel.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {

                //console.log(result['data']);

                var languages = [];

                for (i=0; i < result['data']['language'].length; i++) {
                    languages.push(result['data']['language'][i]['language']);
                };

                var vaccinations = [];

                for (i=0; i < result['data']['vaccinations'].length; i++) {
                    vaccinations.push(result['data']['vaccinations'][i]['name']);
                };

                if (vaccinations == '') {
                    $('#txtVaccinations').html('None required');
                } else {
                    $('#txtVaccinations').html(vaccinations.join(', '));
                };
                
                //console.log(vaccinations);
                
                $('#txtLanguages').html(languages.join(', '));
                $('#txtCallingCode').html("+" + result['data']['telephone']['calling_code']);
                $('#txtEmergency').html("Police: " + result['data']['telephone']['police'] + ", Fire: " + result['data']['telephone']['fire'] + ", Ambulance: " + result['data']['telephone']['ambulance']);
                $('#txtPlugs').html((result['data']['electricity']['plugs']).join(', '));

                if (result['data']['water']['short'] == 'not safe') {
                    $('#txtWater').html('No');
                } else {
                    $('#txtWater').html('Yes');
                }
                
                                
                    

                    
                }               
            },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    $.ajax({
        url: 'libs/php/airports.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#countryCode').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));
            
            if (result.status.name == "ok") {
                    
                //console.log(result['data']['delayIndexes'][0]['airport']['name']);
                for (i = 0; i < 20; i++) {
                    airportLat[i] = result['data']['delayIndexes'][i]['airport']['latitude'];
                    airportLng[i] = result['data']['delayIndexes'][i]['airport']['longitude'];
                    airportMarker[i] = L.marker([airportLat[i], airportLng[i]], {icon: airportIcon})
                                .bindPopup("<p style='text-align: center; font-weight: bold; font-size: 15px;'>" +  result['data']['delayIndexes'][i]['airport']['name'] + "</p><p style='text-align: center;'>" + result['data']['delayIndexes'][i]['airport']['city'] + "</p><p style='text-align: center;'>Latitude: " + result['data']['delayIndexes'][i]['airport']['latitude'] + ", Longitude: " + result['data']['delayIndexes'][i]['airport']['longitude'] + "</p><p style='text-align: center;'>Elevation: " + result['data']['delayIndexes'][i]['airport']['elevationFeet'] + " feet above sea level</p>");
                    markers.addLayer(airportMarker[i]);
                }            
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }

    });

    
    map.addLayer(markers);

});


