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


