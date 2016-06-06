function getRealTimePosition(device) {
    /* Renvoie toutes les 10 secondes la position du device.
       Ici 'device' est une représentation d'un module GPS telle
       que définie par l'instance listjs (la sidebar)*/
    if (device['feature-id'] != null ) {
        var realtime = L.realtime({
	    url: 'liveposition/' + device['feature-id'] + '/',
    	    crossOrigin: true,
    	    type: 'json'
        }, {
	    interval: 10000,
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
        return realtime;
    }
}

function updateLiveMap(sidelist) {
    var list = new Array();
    $.each(sidelist.visibleItems, function(index, item) {
	var data = item.values();
	list.push(data);
    });
    liveLayer.clearLayers();
    $.each(list, function(index, device) {
	var position = getRealTimePosition(device);
	position.addTo(liveLayer);
    });
}

function initSideBar() {
    /* Fonction pour remplir la barre du côté */
    $.getJSON('trackers', function(devices) {
	$("#feature-list tbody").empty();
	$.each(devices, function(index, device) {
	    $("#feature-list tbody").append(
		'<tr class="feature-row" id="' + device.imei + '">' +
		    '<td class="feature-id" style="display: none;">' + device.imei + '</td>' +
		    '<td class="feature-name">' + device.name + '</td>' +
		    '<td style="vertical-align: middle; color: #' + device.color + '">' +
		    '<i class="fa fa-chevron-right"></i>' + '</td>' +
		'</tr>'
	    );
	});
        var featureList = new List("features", {
	    valueNames: ["feature-id", "feature-name"]
        });
        featureList.sort("feature-id", {
	    order: "asc"
        });
        featureList.on("searchComplete", function(e) {
            var list = new Array();
            $.each(e.visibleItems, function(index, item) {
	        var data = item.values();
	        list.push(data);
            });
	});
	featureList.search();
    });
}

function drawTracks(data) {
    L.geoJson(data, {
	pointToLayer: function(feature, latlng) {
	    if (feature.properties.label == "pause") {
		return L.circleMarker(latlng, {
		    radius: 4,
		    fillColor: "#f31000",
		    weight: 2,
		    fillOpacity: 2});
	    } else if (feature.properties.label == "stop") {
		return L.circleMarker(latlng, {
		    radius: 8,
		    fillColor: "#009800",
		    weight: 2,
		    fillOpacity: 2});
	    } else if (feature.properties.label == "start") {
		return L.circleMarker(latlng, {
		    radius: 8,
		    fillColor: "#0000ff",
		    weight: 2,
		    fillOpacity: 2});
	    } else {
		return L.circleMarker(latlng, {
		    radius: 4,
		    fillColor: "#0099ff",
		    weight: 2,
		    fillOpacity: 2});
	    }
	},
	onEachFeature: function(feature, layer) {
	    if (feature.properties) {
		layer.bindPopup(
		    'Date:<b>'+feature.properties.date+'</b><br />'+
                    'Heure: <b>'+feature.properties.hour+'</b><br />Vitesse: <b>'+
			feature.properties.speed+'km/h</b><br />Distance: <b>'+
			feature.properties.distance + 'km</b>');
		if (feature.properties.label == "start") {
		    map.setView(
			[
			    feature.geometry.coordinates[1],
			    feature.geometry.coordinates[0]
			],
			15
		    );
		};
	    }
	},
	style: {
	    color: "#0099ff",
	    weight: 2,
	    opacity: 2
	}
    }).addTo(map);
}

// handler sur le list-btn
$("#list-btn").click(function() {
    $('#sidebar').toggle();
    map.invalidateSize();
    return false;
});

// handler sur le sidebar-hide-btn
$("#sidebar-hide-btn").click(function() {
    $('#sidebar').hide();
    map.invalidateSize();
});

// affichage du formulaire de tracé d'historique
$(document).on("click", ".feature-row", function() {
    var imei = $(this).attr("id");
    var name = $(this).find('.feature-name').html();
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
    $("#featureModal").modal("show");
});

/* quand la page est ok */
L.control.layers({"Carte": osmLayer}, {"Live Position": liveLayer}).addTo(map);
initSideBar();
