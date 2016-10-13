// Global map variable
var map;
var tileLayer;
var parkzonen = [{
    parkzone: 'C',
    jsonFile: './data/zoneC.json',
    layer: ''
}, {
    parkzone: 'D',
    jsonFile: './data/zoneD.json',
    layer: ''
}, {
    parkzone: 'E',
    jsonFile: './data/zoneE.json',
    layer: ''
}, {
    parkzone: 'F',
    jsonFile: './data/zoneF.json',
    layer: ''
}, {
    parkzone: 'G',
    jsonFile: './data/zoneG.json',
    layer: ''
}, {
    parkzone: 'H',
    jsonFile: './data/zoneH.json',
    layer: ''
}, {
    parkzone: 'J',
    jsonFile: './data/zoneJ.json',
    layer: ''
}, {
    parkzone: 'K',
    jsonFile: './data/zoneK.json',
    layer: ''
}, {
    parkzone: 'L',
    jsonFile: './data/zoneL.json',
    layer: ''
}, {
    parkzone: 'M',
    jsonFile: './data/zoneM.json',
    layer: ''
}, {
    parkzone: 'N',
    jsonFile: './data/zoneN.json',
    layer: ''
}, {
    parkzone: 'P',
    jsonFile: './data/zoneP.json',
    layer: ''
}, {
    parkzone: 'R',
    jsonFile: './data/zoneR.json',
    layer: ''
}, {
    parkzone: 'S',
    jsonFile: './data/zoneS.json',
    layer: ''
}, {
    parkzone: 'T',
    jsonFile: './data/zoneT.json',
    layer: ''
}, {
    parkzone: 'U',
    jsonFile: './data/zoneU.json',
    layer: ''
}, {
    parkzone: 'Q',
    jsonFile: './data/zoneQ.json',
    layer: ''
}, {
    parkzone: 'X',
    jsonFile: './data/zoneX.json',
    layer: ''
}, {
    parkzone: 'Y',
    jsonFile: './data/zoneY.json',
    layer: ''
}, {
    parkzone: '3',
    jsonFile: './data/zone3.json',
    layer: ''
}, {
    parkzone: '5',
    jsonFile: './data/zone5.json',
    layer: ''
}, {
    parkzone: '21',
    jsonFile: './data/zone21.json',
    layer: ''
}];



function placeZonesOnMap() {
    for (var zone in parkzonen) {
        var parkzonenKuerzel = parkzonen[zone].parkzone;
        var jsonURL = parkzonen[zone].jsonFile;
        $.ajaxSetup({
            beforeSend: function(xhr) {
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("application/json");
                }
            }
        });

        $.getJSON(jsonURL, function(data) {

            placeZoneOnMap(data);

        });

    }
}


function printObject(obj){
    var str = JSON.stringify(obj, null, 4); // (Optional) beautiful indented output.
    console.log(str); // Logs output to dev tools console.


}


// Place zone on map
function placeZoneOnMap(data) {
    var parkzonenKuerzel = data.properties.parkzonenKuerzel;


    for (var zone in parkzonen) {
        if(parkzonen[zone].parkzone===parkzonenKuerzel){
            var layer = addGeoJSONToMap(data);
            parkzonen[zone].layer= layer;
        }
    }
}

function addGeoJSONToMap(data){
    var layer = L.geoJson([data], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature,
    }).addTo(map);
    return layer;
}

// Initialize map and add a legend
function initMap() {
    map = L.map('map').setView([47.2685694, 11.3932759], 14);
    tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map);

    addLegend();
}

function currentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latit = position.coords.latitude;
            longit = position.coords.longitude;
            //console.log('Current position: ' + latit + ' ' + longit);
            //alert('Current position: ' + latit + ' ' + longit);
            // this is just a marker placed in that position
            var abc = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            // move the map to have the location in its center
            map.panTo(new L.LatLng(latit, longit));
        });
    }
}

function onEachFeature(feature, layer) {
    var popupContent = 'Parkzone: <span style="font-weight: 900; font-size: 150%;">' + feature.properties.parkzonenKuerzel + '</span></br>' + feature.properties.parkzoneInfo;

    layer.bindPopup(popupContent);
    var label = L.marker(layer.getBounds().getCenter(), {
        icon: L.divIcon({
            className: 'label',
            html: '<span style="font-weight: 900; font-size: 200%;color:black;">' + feature.properties.parkzonenKuerzel+'</span>',
            iconSize: [100, 40]
        })
    }).addTo(map);
}

// use the first element that is "scrollable"
function scrollableElement(els) {
    for (var i = 0, argLength = arguments.length; i < argLength; i++) {
        var el = arguments[i],
            $scrollElement = $(el);
        if ($scrollElement.scrollTop() > 0) {
            return el;
        } else {
            $scrollElement.scrollTop(1);
            var isScrollable = $scrollElement.scrollTop() > 0;
            $scrollElement.scrollTop(0);
            if (isScrollable) {
                return el;
            }
        }
    }
    return [];
}

function filterPath(string) {
    return string
        .replace(/^\//, '')
        .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
        .replace(/\/$/, '');
}

function loadScrolling() {
    var locationPath = filterPath(location.pathname);
    var scrollElem = scrollableElement('html', 'body');

    $('a[href*=\\#]').each(function() {
        var thisPath = filterPath(this.pathname) || locationPath;
        if (locationPath == thisPath &&
            (location.hostname == this.hostname || !this.hostname) &&
            this.hash.replace(/#/, '')) {
            var $target = $(this.hash),
                target = this.hash;
            if (target) {
                var targetOffset = $target.offset().top;
                $(this).click(function(event) {
                    event.preventDefault();
                    $(scrollElem).animate({
                        scrollTop: targetOffset
                    }, 400, function() {
                        location.hash = target;
                    });
                });
            }
        }
    });
}

function populateParkzoneDropdown(){
    $('#selectParkzone').empty();
    $('#selectParkzone').append($('<option></option>').val('Bitte Auswählen').html('Zonen'));
    $.each(parkzonen, function(i, p) {
        $('#selectParkzone').append($('<option></option>').val(p.parkzone).html(p.parkzone));
    });

}

$("#selectParkzone").change(function () {
    var selectedParkZone = $("#selectParkzone").val();
    changeParkzoneColor(selectedParkZone);

});

function changeParkzoneColor (selectParkzone){
    resetMap();

    for (var zone in parkzonen) {
        if(parkzonen[zone].parkzone==selectParkzone){
            var layer = parkzonen[zone].layer;

            map.removeLayer(layer);
            layer.setStyle({
                fillColor: 'red',
                fillOpacity: 0.7
            });
            map.addLayer(layer);
        }
    }
}
function resetMap(){
    console.log('reset');
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(tileLayer);
    placeZonesOnMap();
}

/*
In der interaktiven Stadtkarte sind die Parkzonen mit <span style="font-weight: 600;color:#72B2FF;">90 minütiger Parkdauer</span>, die <span style="font-weight: 600;color:#BEE7FF;">Parkzonen mit 180 minütiger Parkdauer</span>, <span style="font-weight: 600;color:#A3FF72;">werktägliche Parkstraßen</span>					und <span style="font-weight: 600;color:#D8D0F4;">tägliche Parkstraßen</span> eingezeichnet.

*/

/* Add a legend to the map. */
function addLegend(){
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML =
        '<i style="background:#72B2FF";></i><span style="font-weight: 600;">90 Minuten Kurzparkzone</span><br>' +
        '<i style="background:#BEE7FF";></i><span style="font-weight: 600;">180 Minuten Kurzparkzone</span><br>' +
        '<i style="background:#A3FF72";></i><span style="font-weight: 600;">Werktags Parkstraße</span><br>' +
        '<i style="background:#D8D0F4";></i><span style="font-weight: 600;">Parkstraße</span><br>';

    return div;
};

legend.addTo(map);
}
