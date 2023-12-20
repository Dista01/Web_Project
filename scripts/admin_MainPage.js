
document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);






});


/*fetch('/server/location.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);

  })
  .catch(error => console.error('Error:', error));*/


/*
  fetch('/server/map_admin/offers.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

    })
    .catch(error => console.error('Error:', error));

  fetch('/server/map_admin/vehicles.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

    })
    .catch(error => console.error('Error:', error));

  fetch('/server/map_admin/citizen.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

    })
    .catch(error => console.error('Error:', error));

});*/
/*
function createAndPinMarker(data) {
 
    var lat = data.lat;
    var long = data.longi;
    var typeloc = data.typeloc;
    var markerColor;
    var popupContent;
}
if (typeloc === 'off') {
  markerColor = 'green';
  popupContent = '<b>Base</b><br>Base Location';
} else if (typeloc === 'veh') {
  markerColor = 'blue';
  popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
    '<br>Condition: ' + data.condition;

  connectMarkers([lat, long], tasksMarkers[data.username]);
} else if (typeloc === 'req') {
  markerColor = 'red';
  popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
    '<br>Condition: ' + data.condition;
} else {
  console.error('Unknown marker type:', typeloc);
  return;
}

var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
marker.bindPopup(popupContent).openPopup();


if (typeloc === 'veh') {
  vehiclesMarkers[data.username] = marker;
} else if (typeloc === 'req') {
  requestsMarkers[data.id] = marker;
} else if (typeloc === 'off') {
  offersMarkers[data.id] = marker;
}

function connectMarkers(coords1, coords2) {
if (coords1 && coords2) {
  var line = L.polyline([coords1, coords2.getLatLng()], { color: 'black' }).addTo(map);
}
}
;
*/


/*
////////////////VEHICLE MARKER////////////////////
var vehIcon = L.icon({

  iconSize: [300, 300], 
    iconAnchor: [15, 15] 
  });

 */
/*
var vehMarker = L.marker([37.9838, 23.7275], {
    draggable: true,
    icon: vehIcon 
  }).addTo(map);   

  // Event listener for marker dragend event
  /*
  vehMarker.on('dragend', function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    alert('Location confirmed: ' + position.lat + ', ' + position.lng);
  });*/