var map = L.map('map').setView([33.8869, 9.5375], 6);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox/light-v9',
tileSize: 512,
zoomOffset: -1
}).addTo(map);



// fullscreen control
		var fsControl = L.control.fullscreen();
		// add fullscreen control to the map
		map.addControl(fsControl);

		// detect fullscreen toggling
		map.on('enterFullscreen', function(){
			if(window.console) window.console.log('enterFullscreen');
		});
		map.on('exitFullscreen', function(){
			if(window.console) window.console.log('exitFullscreen');
		});


// Tunisie:
	var info = L.control();

	info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
	};

	info.update = function (props) {
	this._div.innerHTML = '<h4>Tunisia Population Density</h4>' + (props ?
	'<b>' + props.gouvernora + '</b><br />' + props.Density + ' people / km<sup>2</sup>' : 'Hover over a governorate');
	};

	info.addTo(map);


// get color depending on population density value
function getColor(d) {
return d > 4000 ? '#800026' :
		d > 2000 ? '#BD0026' :
		d > 1000 ? '#E31A1C' :
		d > 500 ? '#FC4E2A' :
		d > 100 ? '#FD8D3C' :
		d > 50 ? '#FEB24C' :
		d > 10 ? '#FED976' : '#FFEDA0';
		}

function style(feature) {
	return {
	weight: 2,
	opacity: 1,
	color: 'white',
	dashArray: '3',
	fillOpacity: 0.7,
	fillColor: getColor(feature.properties.Density)
	};
	}

function highlightFeature(e) {
var layer = e.target;

layer.setStyle({
weight: 5,
color: '#666',
dashArray: '',
fillOpacity: 0.7
});

if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
layer.bringToFront();
}

info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
geojson.resetStyle(e.target);
info.update();
}

function zoomToFeature(e) {
map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
layer.on({
mouseover: highlightFeature,
mouseout: resetHighlight,
click: zoomToFeature
});
}

/* global statesData */
geojson = L.geoJson(popDATA, {
style: style,
onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://www.ins.tn/">INS</a>');



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend');
var grades = [50, 100, 500, 1000, 2000, 4000];
var labels = [];
var from, to;

for (var i = 0; i < grades.length; i++) {
from = grades[i];
to = grades[i + 1];

labels.push(
'<i style="background:' + getColor(from + 1) + '"></i> ' +
from + (to ? '&ndash;' + to : '+'));
}

div.innerHTML = labels.join('<br>');
return div;
};

legend.addTo(map);