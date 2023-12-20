
document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);



  fetch("/server/map_admin/base.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {

        //////////BASE MARKER LOCATION///////////
        var BaseMarker = L.marker([data.base_location.lat, data.base_location.lng], {
          draggable: true
        }).addTo(map);

        BaseMarker.on('dragend', function (event) {
          let marker = event.target;
          let position = marker.getLatLng();

          //Base Location confirm
          let isConfirmed = confirm('Do you want to confirm this location?');
          if (isConfirmed) {

            const new_position = {
              lati: position.lat,
              long: position.lng,
            };

            fetch("/server/map_admin/base_upload.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(new_position),
            })
              .then((response) => response.json())
              .then((upload) => {
                if (upload.status === "error") {
                  console.error("Server Error:", upload.Error);
                } else {
                  data.base_location.lat=position.lat;
                  data.base_location.lng=position.lng;
                  //confirmation 
                  alert('Base Location confirmed: ' + position.lat + ', ' + position.lng);
                }
              })
              .catch((error) => console.error("Error:", error));

          } else {
            BaseMarker.setLatLng([data.base_location.lat, data.base_location.lng]);
            alert('Base Location not confirmed');
          }
        });
      }
    })
    .catch((error) => console.error("Error:", error));



  var markers = [];
  fetch('/server/map_admin/citizen_requests.php')
    .then(response => response.json())
    .then(data => {

      var requestsData = data.requests;
      

      for (var i = 0; i < requestsData.length; i++) {
        var request = requestsData[i];

        if (i !== 0) {
            var check=false;
          for (var j = 0; j < i; j++) {

            if (requestsData[j].citizen_id === request.citizen_id) {
              check=true;
              break
            }

          }
          if (check===false) {

            var requestMarker = L.marker([request.lati, request.long], {
              icon: L.icon({
                iconUrl: `/leaflet/images/marker-icon-red.png`,
                shadowUrl: `/leaflet/images/marker-shadow.png`,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              }),
              marker_id: request.citizen_request_id
            }).addTo(map);


            if (request.pickup_date !== null && request.veh_username !== null) {

              var popupContent = `
                <div style="height: 100px; overflow-y: auto;">
                <b>Request</b><br>
                <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
                <b>Phone:</b> ${request.phone_number}<br>
                <b>Date of Submission:</b> ${request.submission_date}<br>
                <b>Quantity:</b> ${request.quantity}<br>
                <b>Pickup Date:</b> ${request.pickup_date}<br>
                <b>Vehicle Username:</b> ${request.veh_username}<br><br>
                `;
            } else {
              var popupContent = `
                <div style="height: 100px; overflow-y: auto;">
                <b>Request</b><br>
                <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
                <b>Phone:</b> ${request.phone_number}<br>
                <b>Date of Submission:</b> ${request.submission_date}<br>
                <b>Quantity:</b> ${request.quantity}<br><br>
               `;
            }

            requestMarker.bindPopup(popupContent);

          } else {

           
            marker_search = markers.find(marker => marker.options.marker_id = request.citizen_id)

            if (request.pickup_date !== null && request.veh_username !== null) {

              var popupContent = `
                <b>Request</b><br>
                <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
                <b>Phone:</b> ${request.phone_number}<br>
                <b>Date of Submission:</b> ${request.submission_date}<br>
                <b>Quantity:</b> ${request.quantity}<br>
                <b>Pickup Date:</b> ${request.pickup_date}<br>
                <b>Vehicle Username:</b> ${request.veh_username}<br><br>
                `;
            } else {
              var popupContent = `
                <b>Request</b><br>
                <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
                <b>Phone:</b> ${request.phone_number}<br>
                <b>Date of Submission:</b> ${request.submission_date}<br>
                <b>Quantity:</b> ${request.quantity}<br><br>
                `;
            }

            cur_content = marker_search.getPopup().getContent();
            marker_search.getPopup().setContent(cur_content + popupContent);

          }

        } else if (i === 0) {

          var requestMarker = L.marker([request.lati, request.long], {
            icon: L.icon({
              iconUrl: `/leaflet/images/marker-icon-red.png`,
              shadowUrl: `/leaflet/images/marker-shadow.png`,
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              marker_id: request.citizen_request_id
            })
          }).addTo(map);


          markers.push(requestMarker);

          if (request.pickup_date !== null && request.veh_username !== null) {

            var popupContent = `
              <div style="height: 100px; overflow-y: auto;">
              <b>Request</b><br>
              <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
              <b>Phone:</b> ${request.phone_number}<br>
              <b>Date of Submission:</b> ${request.submission_date}<br>
              <b>Quantity:</b> ${request.quantity}<br>
              <b>Pickup Date:</b> ${request.pickup_date}<br>
              <b>Vehicle Username:</b> ${request.veh_username}<br><br>
             `;
          } else {
            var popupContent = `
              <div style="height: 100px; overflow-y: auto;">
              <b>Request</b><br>
              <b>Name:</b> ${request.first_name + " " + request.last_name}<br>
              <b>Phone:</b> ${request.phone_number}<br>
              <b>Date of Submission:</b> ${request.submission_date}<br>
              <b>Quantity:</b> ${request.quantity}<br><br>
             `;
          }

          requestMarker.bindPopup(popupContent);
        }
      }


    })
    .catch(error => console.error('Error:', error));


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