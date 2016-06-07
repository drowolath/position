function getRealTimePosition(device, layer) {
    /* Renvoie toutes les 5 secondes la position du device.
       Ici 'device' est une représentation d'un module GPS telle
       que définie par l'instance listjs (la sidebar)*/
    if (device['feature-id'] != null ) {
        var realtime = L.realtime({
	    url: device['feature-id'],
    	    crossOrigin: true,
    	    type: 'json'
        }, {
	    interval: 5000,
	    pointToLayer: function(feature, latlng) {
	        // on représente les objets Point par des cercles
	        var devicecolor = feature.properties.color
	        var mystyle = {
		    radius: 5,
		    fillColor: "#" + devicecolor,
		    color: "#" + devicecolor,
		    fillOpacity: 8,
    		    weight: 2,
    		    opacity: 1
	        };
	        return L.circleMarker(latlng, mystyle);
	    },
	    onEachFeature: function(feature, layer) {
		c = feature.properties;
		var date = new Date(c.datetime*1000);
    	        var hours = date.getHours();
	    	var minutes = '0' + date.getMinutes();
	    	var seconds = '0' + date.getSeconds();
                var time = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	    	var text = '<b>' + device['feature-name'] + '</b><br/>' +
	    		'<b>Date</b>: ' + date.toLocaleDateString() + '<br/>' +
	    		'<b>Heure</b>: ' + time + '<br/>' +
		        '<b>Vitesse</b>: ' + c.speed + ' km/h';
		layer.bindPopup(text);
	    }
	});
        realtime.addTo(layer);
    }
}

/* Initialisation du fond de carte et de tous les attributs liés */
var liveLayer = new L.layerGroup();
var osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    MaxZoom: 23,
    subdomains:["a", "b", "c"],
    attribution: "Gulfsat Madagascar"
});

var map = L.map('map', {
    center: [-18.886216, 47.489114],
    zoom: 13,
    layers: [osmLayer, liveLayer]
});

L.control.layers({"Carte": osmLayer}, {"Positions live": liveLayer}).addTo(map);

/* Initialisation de la liste de device avec listjs */
var deviceList = new List("devices", {valueNames: ["device-id", "device-name"]});
deviceList.sort("device-id", {order: "asc"});
deviceList.on("searchComplete", function(e) {
    liveLayer.clearLayers();
    $.each(e.visibleItems, function(index, item) {
	var device = item.values();
	getRealTimePosition(device, livelayer);
    });    
});
deviceList.search();