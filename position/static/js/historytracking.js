function drawTracks(tracks) {
    /* on trace le trajet sous forme de polyline */
    var route = tracks.features[tracks.features.length-1].geometry.coordinates;
    for (var i = 0, latlngs = [], len = route.length; i < len; i++) {
	latlngs.push(new L.LatLng(route[i][1], route[i][0]));
    }
    var path = L.polyline(latlngs);
    map.fitBounds(L.latLngBounds(latlngs));
    map.addLayer(L.marker(latlngs[0]).bindPopup('start'));
    map.addLayer(L.marker(latlngs[len-1]).bindPopup('stop'));
    map.addLayer(path);
    
    return path;
}


var positionLayer = new L.layerGroup();
var osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    MaxZoom: 23,
    subdomains:["a", "b", "c"],
    attribution: "Gulfsat Madagascar"
});
var map = L.map('map', {
    center: [-18.886216, 47.489114],
    zoom: 13,
    layers: [osmLayer, positionLayer]
});
L.control.layers({"Carte": osmLayer}, {"Positions": positionLayer}).addTo(map);

$(document).on("click", ".device-row", function() {
    var lat = parseFloat($(this).find(".position-lat").html());
    var lng = parseFloat($(this).find(".position-lon").html());
    positionLayer.clearLayers();
    L.marker([lat, lng]).addTo(positionLayer);
    
});

var positionList = new List("positions", {valueNames: ["position-datetime", "position-speed"]});
positionList.search();
