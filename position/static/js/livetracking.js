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
