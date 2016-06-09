function getRealTimePosition(device, livelayer) {
    /* Renvoie toutes les 5 secondes la position du device.
       Ici 'device' est une représentation d'un module GPS telle
       que définie par l'instance listjs (la sidebar)*/
    var realtime = L.realtime({
	url: device['device-id'],
	crossOrigin: true,
	type: 'json'}, {
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
	    	var text = '<b>' + device['device-name'] + '</b><br/>' +
	    		'<b>Date</b>: ' + date.toLocaleDateString() + '<br/>' +
	    		'<b>Heure</b>: ' + time + '<br/>' +
		        '<b>Vitesse</b>: ' + c.speed + ' km/h';
		layer.bindPopup(text);
	    }
	});
    realtime.addTo(livelayer);
}

/* gestion d'évènement sur click d'un device dans la sidebar*/
$(document).on("click", ".device-row", function() {
    var imei = $(this).attr("id");
    var name = $(this).find('.device-name').html();
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth()+1)  + "/" +
        currentdate.getFullYear() + " " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes();
    $('#id_start, #id_stop').datetimepicker(
    	{format : 'DD/MM/YYYY HH:mm:ss', language : 'fr'});
    $('#id_start, #id_stop').data("DateTimePicker").setMaxDate(datetime);
    $("#feature-title").html("Historiqe des traces de "+name);
    $("#history").attr("action", ".");
    $("#id_imei").val(imei);
    $('#featureModal').modal('show');
});

/* création de la couche sur laquelle on va dessiner les positions live */
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

/* en fonction de ce qu'il y a dans la sidebar on ajuste ce qui s'affiche sur la carte */
var deviceList = new List("devices", {valueNames: ["device-id", "device-name"]});
deviceList.sort("device-id", {order: "asc"});
deviceList.on("searchComplete", function(e) {
    liveLayer.clearLayers();
    $.each(e.visibleItems, function(index, item) {
	var device = item.values();
	getRealTimePosition(device, liveLayer);
    });
});
deviceList.search();
