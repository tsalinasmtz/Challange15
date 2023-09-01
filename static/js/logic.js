// Create tile layers - map backgrounds
var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "dark-v10",
  accessToken: API_KEY
});
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "light-v10",
  accessToken: API_KEY
});
var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "satellite-v9",
  accessToken: API_KEY
});

// Create basemap object for all layers - only one layer can be shown at a time
var baseMaps = {
    "Dark": darkMap,
    "Light": lightMap,
    "Satellite": satMap
}

// Initialize layer groups to use on map
var quakeMarkers = L.layerGroup();


// Create overlay object for layer control on map
var overlays = {
    "Markers": quakeMarkers
}

// Create map object with default layers
var myMap = L.map("map", {
    center: [30.0000, 0.0000],
    zoom: 3,
    layers: [satMap, quakeMarkers]
  });

// Add layer control to map - pass map layers
L.control.layers(baseMaps, overlays, {collapsed:false}).addTo(myMap);

// Link for geojson data of earthquakes
var quakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function for setting color of quake by depth
function setColors(depth){
    if (depth <= 10) {
        return "#99ff66";
    } else if (depth <= 30){
        return "#ffff66";
    } else if (depth <= 50){
        return "#ffc266";
    } else if (depth <= 70){
        return "#ff9900";
    } else if (depth <= 90){
        return "#ff3333";
    } else {
        return "#cc0000";
    }};

// Request geojson data
d3.json(quakeLink).then(function(data){
    // Loop data to get coords/magnitude
    features = data.features;
    for (var i=0; i<features.length; i++) {
        var magnitude = features[i].properties.mag;
        var coordinates = features[i].geometry.coordinates;
        // Create markers
        var markers = L.circleMarker([coordinates[1], coordinates[0]], {
            fillOpacity: 0.8,
            fillColor: setColors(coordinates[2]),
            color: "black",
            weight: 0.3,
            radius: magnitude * 4
        }).addTo(quakeMarkers);

        // Add popup when circle clicked
        markers.bindPopup("<h2>" + features[i].properties.place + "</h2><hr><h4>" + "Magnitude Level: " + magnitude + 
        "<br>" + new Date(features[i].properties.time) + "<br>" + 
        "Location: [" + coordinates[1] + ", " + coordinates[1] + "]" + "</h4>");
    }

        var legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        var div =  L.DomUtil.create("div", "info legend");
        var depth = ["<10", "10-30", "30-50", "50-70", "70-90", ">90"];
        var colors = ["#99ff66", "#ffff66", "#ffc266", "#ff9900", "#ff3333", "#cc0000"]
        var labels = [];
        // Insert legend to html
        div.innerHTML 
            
        depth.forEach(function(depth, i) {
            labels.push(`<ul style="background-color: ${colors[i]}">${depth} km </ul>`);
      });
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
      // Adding legend to the map
      legend.addTo(myMap);
});


