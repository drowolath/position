var osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    MaxZoom: 23,
    subdomains:["a", "b", "c"],
    attribution: "Gulfsat Madagascar"
});

var map = L.map('map', {
    center: [-18.886216, 47.489114],
    zoom: 13,
    layers: [osmLayer]
});
