var map;
var map_control;
var layerSelected;

document.addEventListener('DOMContentLoaded', function () {


  fetch("/server/get_Session_info.php")
    .then((jsonResponse) => jsonResponse.json())
    .then(data => {
      document.getElementById("text").textContent = data.Name;
    })
    .catch((error) => console.error("Error:", error));


  map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  layerSelected = {
    "Request Pending": true,
    "Request Accepted": true,
    "Offer Accepted": true,
    "Offer Pending": true,
    "Truck Active": true,
    "Truck Inactive": true,
    "Lines": true,
    "Base": true,
  };


  var markersLayers = {};
  markersLayers["Lines"] = L.layerGroup();

  var geoJson;
  fetch('/server/rescuer/rescuer_geojson.php')
    .then(response => response.json())
    .then(data => {

      geoJson = data;
      data.features.forEach((feature, index) => {
        const category = feature.properties.category;

        if (!markersLayers[category]) {
          markersLayers[category] = L.layerGroup();
        }

        var check = 0;

        data.features.forEach((features_check, index_check) => {
          if (features_check.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
            features_check.geometry.coordinates[1] === feature.geometry.coordinates[1] &&
            (category !== "Base" || category !== "Truck Active" || category !== "Truck Inactive") &&
            index !== index_check) {
            check = 1;
          }

        });

        const customMarkers = L.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
          icon: (function () {
            if (category === "Base") {
              return L.icon({
                iconUrl: '/leaflet/images/offices.png',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [0, -52],
              });
            } else if (category === "Request Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [2.5, -20]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [13, -35]
                });
              }
            } else if (category === "Request Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [15, -35]
                });
              }
            } else if (category === "Offer Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [20.5, 38],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-20, -35]
                });
              }
            } else if (category === "Offer Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-17, -35]
                });
              }
            } else if (category === "Truck Active") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-green.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            } else if (category === "Truck Inactive") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-red.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable:
            category === "Truck Active" ||
            category === "Truck Inactive",
          category: (function () {
            if (category === "Base") {
              return "Base";
            } else if (category === "Request Pending") {
              return "Request Pending";
            } else if (category === "Request Accepted") {
              return "Request Accepted";
            } else if (category === "Offer Accepted") {
              return "Offer Accepted";
            } else if (category === "Offer Pending") {
              return "Offer Pending";
            } else if (category === "Truck Active") {
              return "Truck Active";
            } else if (category === "Truck Inactive") {
              return "Truck Inactive";
            }
          })(),
          id: (function () {
            if (category === "Base") {
              return 1;
            } else if (category === "Request Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Request Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Truck Active") {
              return parseInt(feature.properties.vehicle_id);
            } else if (category === "Truck Inactive") {
              return parseInt(feature.properties.vehicle_id);
            }
          })(),
        });

        if (category === "Base") {

          customMarkers.bindPopup('<strong>Base</strong>');

        } else if (category === "Request Pending") {
          var requests = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            if (request.vehicle_id === null) {
              var info = `<br><strong>Request</strong><br>
            <strong>Submission date:</strong> ${request.submission_date}<br>
            <strong>Item:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            ----------------------------------`;
            } else {
              var info = `<br><strong>Request</strong><br>
              <strong>Submission date:</strong> ${request.submission_date}<br>
              <strong>Item:</strong> ${request.item_name}<br>
              <strong>Quantity:</strong> ${request.quantity}<br>
              <strong>Pickup date:</strong> ${request.pickup_date}<br>
              <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
              ----------------------------------`;
            }
            info_citizen = info_citizen + info;
            requests.push(request.request_id);
          });


          info_citizen = info_citizen + `</div>`;


          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;
          
        } else if (category === "Request Accepted") {
          var requests = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            var info = `<br><strong>Request</strong><br>
            <strong>Submission date:</strong> ${request.submission_date}<br>
            <strong>Item:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            <strong>Pickup date:</strong> ${request.pickup_date}<br>
            <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
            ----------------------------------`;
            info_citizen = info_citizen + info;
            requests.push(request.request_id);
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;
        } else if (category === "Offer Accepted") {
          var offers = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((offer) => {
            var info = `<br><strong>Offer</strong><br>
            <strong>Submission date:</strong> ${offer.submission_date}<br>
            <strong>Pickup date:</strong> ${offer.pickup_date}<br>
            <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

            offer.items.forEach((item) => {
              info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
               <strong>Quantity:</strong> ${item.quantity}<br>`;
            });

            offers.push(offer.offer_id);
            info_citizen = info_citizen + info + ` ----------------------------------`;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;

        } else if (category === "Offer Pending") {
          var offers = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;


          feature.properties.details.forEach((offer) => {

            if (offer.vehicle_id === null) {
              var info = `<br><strong>Offer</strong><br>
            <strong>Submission date:</strong> ${offer.submission_date}<br>`

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
               <strong>Quantity:</strong> ${item.quantity}<br>`
              });

              info_citizen = info_citizen + info + ` <button id="${offer.offer_id}">Accept</button><br>`
                + ` ----------------------------------`;
              offers.push(offer.offer_id);
            } else {
              var info = `<br><strong>Offer</strong><br>
              <strong>Submission date:</strong> ${offer.submission_date}<br>
              <strong>Pickup date:</strong> ${offer.pickup_date}<br>
              <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
                 <strong>Quantity:</strong> ${item.quantity}<br>`;
              });
              info_citizen = info_citizen + info + ` ----------------------------------`;
              offers.push(offer.offer_id);
            }
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;
        } else if (category === "Truck Active") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
              <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
              info_truck = info_truck + info;
            });
          }

          feature.properties.requests.forEach((cargo) => {
            data.features.forEach((detail) => {

              if (detail.properties.category === "Request Pending" || detail.properties.category === "Request Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.request_id === cargo.request_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      request_id: id.request_id
                    }).addTo(markersLayers["Lines"]);
                  }
                });
              }
            });
          });

          feature.properties.offers.forEach((cargo) => {

            data.features.forEach((detail) => {
              if (detail.properties.category === "Offer Pending" || detail.properties.category === "Offer Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.offer_id === cargo.offer_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      offer_id: id.offer_id
                    }).addTo(markersLayers["Lines"]);

                  }
                });
              }

            });
          });

          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        } else if (category === "Truck Inactive") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
              <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
              info_truck = info_truck + info;
            });
          }
          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        }


        markersLayers[category].addLayer(customMarkers);
        markersLayers[category].addTo(map);


        if (category === "Request Pending") {

          customMarkers.on('popupopen', function () {
            customMarkers.options.request_id.forEach(id => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Request Pending") {
                  feature.properties.details.forEach(detail => {
                    if (detail.request_id === id && detail.vehicle_id === null) {
                      document.getElementById(id).addEventListener('click', function () {
                        data.features.forEach(feature => {
                          if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                            if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                              const data = {
                                request: detail.request_id,
                              };

                              fetch("/server/rescuer/accept_request.php", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                              })
                                .then((response) => response.json())
                                .then((data) => {

                                  mapPanelRefresh();

                                })
                                .catch((error) => console.error("Error:", error));
                            } else {
                              alert("Τhe vehicle has the maximum tasks it can receive")
                            }
                          }
                        })
                      });
                    }
                  });
                }
              });
            });
          });
        } else if (category === "Offer Pending") {

          customMarkers.on('popupopen', function () {
            customMarkers.options.offer_id.forEach(id => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Offer Pending") {
                  feature.properties.details.forEach(detail => {

                    if (detail.offer_id === id && detail.vehicle_id === null) {
                      document.getElementById(id).addEventListener('click', function () {

                        data.features.forEach(feature => {
                          if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                            if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                              const data = {
                                offer: detail.offer_id,
                              };

                              fetch("/server/rescuer/accept_offer.php", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                              })
                                .then((response) => response.json())
                                .then((data) => {

                                  mapPanelRefresh();

                                })
                                .catch((error) => console.error("Error:", error));
                            } else {
                              alert("Τhe vehicle has the maximum tasks it can receive")
                            }
                          }
                        })
                      });
                    }
                  });
                }
              });
            });
          });


        }

        if (category === "Truck Active") {
          customMarkers.on('drag', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();


            markersLayers["Lines"].eachLayer(line => {
              const line_position = line.getLatLngs();
              const line_end1 = line_position[0].lat === feature.geometry.coordinates[0] && line_position[0].lng === feature.geometry.coordinates[1];
              const line_end2 = line_position[1].lat === feature.geometry.coordinates[0] && line_position[1].lng === feature.geometry.coordinates[1];

              if (line_end1 || line_end2) {
                let line_update;
                if (line_end1) {
                  line_update = [position.lat, position.lng];
                } else {
                  line_update = line_position[0];
                }

                if (line_end2) {
                  line.setLatLngs([
                    line_update,
                    [position.lat, position.lng]
                  ]);
                } else {
                  line.setLatLngs([
                    line_update,
                    line_position[1]
                  ]);
                }
              }
            });

            feature.geometry.coordinates[0] = position.lat;
            feature.geometry.coordinates[1] = position.lng;
          });



          customMarkers.on('dragend', function (event) {
            const marker = event.target;

            if (marker.options.category === "Truck Active") {
              const position = marker.getLatLng();

              const data = {
                id: marker.options.id,
                lat: position.lat,
                lng: position.lng,
              };

              fetch("/server/map_admin/truck_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(data => {

                })
                .catch((error) => console.error("Error:", error));
            }
          });

        }

        if (category === "Truck Inactive") {
          customMarkers.on('dragend', function (event) {
            const marker = event.target;

            if (marker.options.category === "Truck Inactive") {
              const position = marker.getLatLng();

              const data = {
                id: marker.options.id,
                lat: position.lat,
                lng: position.lng,
              };

              fetch("/server/map_admin/truck_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(data => {

                })
                .catch((error) => console.error("Error:", error));
            }
          });
        }
      });

      var distanceMarker;

      if ("Truck Active" in markersLayers) {
        markersLayers["Truck Active"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

          });
        })
      }

      if ("Truck Inactive" in markersLayers) {
        markersLayers["Truck Inactive"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

          });
        })
      }

      if (distanceMarker < 100) {
        document.getElementById("load").disabled = false;
        document.getElementById("unload").disabled = false;
      } else {
        document.getElementById("load").disabled = true;
        document.getElementById("unload").disabled = true;
      }

      if ("Truck Active" in markersLayers) {
        markersLayers["Truck Active"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            truck.on("drag", function () {
              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

              if (distanceMarker < 100) {
                document.getElementById("load").disabled = false;
                document.getElementById("unload").disabled = false;
              } else {
                document.getElementById("load").disabled = true;
                document.getElementById("unload").disabled = true;
              }
            });

          });
        })
      }

      if ("Truck Inactive" in markersLayers) {
        markersLayers["Truck Inactive"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            truck.on("drag", function () {
              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

              if (distanceMarker < 100) {
                document.getElementById("load").disabled = false;
                document.getElementById("unload").disabled = false;
              } else {
                document.getElementById("load").disabled = true;
                document.getElementById("unload").disabled = true;
              }
            });

          });
        })
      }


      map.on('layerremove', function (event) {
        var removedLayer = event.layer;
        layerSelected[removedLayer.options.category] = false;

        if (removedLayer.options.category === "Request Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Request Accepted") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Offer Accepted") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Offer Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Truck Active") {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(offer => {
                  if (offer.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
        }
      });

      map.on('layeradd', function (event) {
        var addLayer = event.layer;

        if (addLayer.options.category === "Request Pending") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Request Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Pending") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Truck Active") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(offer => {
                  if (offer.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
        } else if (addLayer.options.category === "Truck Inactive") {
          layerSelected[addLayer.options.category] = true;
        } else if (addLayer.options.category === "Lines") {
          layerSelected[addLayer.options.category] = true;
        }
      });

      markersLayers["Lines"].addTo(map);
      map_control = L.control.layers(null, markersLayers).addTo(map);

      truck_cargo(data);

      fetch("/server/rescuer/rescuer_tasks.php")
        .then(response => response.json())
        .then(data => {

          const panel = document.getElementById("tasks_info");

          panel.innerHTML = "";

          data.requests.forEach(request => {
            const row_table = document.createElement("tr");
            const name = document.createElement("td");
            const phone_number = document.createElement("td");
            const type = document.createElement("td");
            const date = document.createElement("td");
            const item = document.createElement("td");
            const quantity = document.createElement("td");
            const action = document.createElement("td");

            name.textContent = request.citizen_name;
            phone_number.textContent = request.phone_number;
            type.textContent = "Request";
            const date_sub = request.submission_date.split(' ');
            date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
            item.textContent = request.item_name
            quantity.textContent = request.quantity;
            action.innerHTML = `
          <button id="request_${request.request_id}_accept">Complete</button>
          <button id="request_${request.request_id}_cancel">Cancel</button>`;

            row_table.appendChild(name);
            row_table.appendChild(phone_number);
            row_table.appendChild(type);
            row_table.appendChild(date);
            row_table.appendChild(item);
            row_table.appendChild(quantity);
            row_table.appendChild(action);
            panel.appendChild(row_table);

            document.getElementById(`request_${request.request_id}_cancel`).addEventListener("click", function () {

              const data = {
                id: request.request_id,
              };


              fetch("/server/rescuer/cancel_request.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  mapPanelRefresh();
                })
                .catch((error) => console.error("Error:", error));
            });

            var distanceMarker;

            if ("Request Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                  requestLayerPending.options.request_id.forEach(idCheck => {

                    if (idCheck === request.request_id) {
                      distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Request Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {

                  requestLayerAccepted.options.request_id.forEach(idCheck => {

                    if (idCheck === request.request_id) {
                      distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Request Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                    requestLayerPending.options.request_id.forEach(idCheck => {

                      if (idCheck === request.request_id) {
                        distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if ("Request Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {

                    requestLayerAccepted.options.request_id.forEach(idCheck => {

                      if (idCheck === request.request_id) {
                        distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if (distanceMarker > 50) {
              document.getElementById(`request_${request.request_id}_accept`).disabled = true;
            } else {
              document.getElementById(`request_${request.request_id}_accept`).disabled = false;
            }


            document.getElementById(`request_${request.request_id}_accept`).addEventListener("click", function () {

              var item_check = 0;
              var quantity_check = 0;
              var cargo_quantity;
              geoJson.features.forEach(features => {
                if (features.properties.category === "Truck Active") {
                  features.properties.cargo.forEach(cargo => {
                    if (cargo.item_id === request.item_id) {
                      item_check = 1;
                      cargo_quantity = cargo.quantity;
                      if (cargo.quantity >= request.quantity) {

                        quantity_check = 1;

                        const data = {
                          id: request.request_id,
                          quantity: request.quantity,
                          item_id: request.item_id,
                        };

                        fetch("/server/rescuer/complete_request.php", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
                        })
                          .then((response) => response.json())
                          .then((data) => {
                            if (data.status === "error") {
                              console.error("Server Error:", data.Error);
                            } else {
                              alert("Request Complete");
                              mapPanelRefresh();

                              fetch("/server/rescuer/rescuer_geojson.php")
                                .then((response) => response.json())
                                .then((cargo) => {

                                  truck_cargo(cargo);

                                })
                                .catch((error) => console.error("Error:", error))
                            }
                          })
                          .catch((error) => console.error("Error:", error));

                      }
                    }
                  });
                }
              });

              if (item_check === 0) {
                alert(`The truck do not have the item ${request.item_name} to complete request`);
              } else if (quantity_check === 0) {
                alert(`The truck do not have the quantity of the item to complete request (Request: ${request.quantity}, Truck: ${cargo_quantity})`);
              }

            });
          });

          data.offers.forEach(offer => {
            const row_table = document.createElement("tr");
            const name = document.createElement("td");
            const phone_number = document.createElement("td");
            const type = document.createElement("td");
            const date = document.createElement("td");
            const item = document.createElement("td");
            const quantity = document.createElement("td");
            const action = document.createElement("td");

            name.textContent = offer.citizen_name;
            phone_number.textContent = offer.phone_number;
            type.textContent = "Offer";
            const date_sub = offer.submission_date.split(' ');

            date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
            action.innerHTML = `
          <button id="offer_${offer.offer_id}_accept">Complete</button>
          <button id="offer_${offer.offer_id}_cancel">Cancel</button>`;

            var items_name_array = [];
            var items_quantity_array = [];
            offer.items.forEach(items => {
              items_name_array.push(items.item_name);
              items_quantity_array.push(items.quantity);
            })

            item.innerHTML = items_name_array.join("<br>");
            quantity.innerHTML = items_quantity_array.join("<br>");

            row_table.appendChild(name);
            row_table.appendChild(phone_number);
            row_table.appendChild(type);
            row_table.appendChild(date);
            row_table.appendChild(item);
            row_table.appendChild(quantity);
            row_table.appendChild(action);

            panel.appendChild(row_table);


            document.getElementById(`offer_${offer.offer_id}_cancel`).addEventListener("click", function () {

              const data = {
                id: offer.offer_id,
              };

              fetch("/server/rescuer/cancel_offer.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {

                  mapPanelRefresh();

                })
                .catch((error) => console.error("Error:", error));
            });

            var distanceMarker;

            if ("Offer Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                  offerLayerPending.options.offer_id.forEach(idCheck => {

                    if (idCheck === offer.offer_id) {
                      distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Offer Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                  offerLayerAccepted.options.offer_id.forEach(idCheck => {

                    if (idCheck === offer.offer_id) {
                      distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Offer Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                    offerLayerPending.options.offer_id.forEach(idCheck => {

                      if (idCheck === offer.offer_id) {
                        distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if ("Offer Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                    offerLayerAccepted.options.offer_id.forEach(idCheck => {

                      if (idCheck === offer.offer_id) {
                        distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if (distanceMarker > 50) {
              document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
            } else {
              document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
            }


            document.getElementById(`offer_${offer.offer_id}_accept`).addEventListener("click", function () {


              offer.items.forEach(item => {

                const data = {
                  id: offer.offer_id,
                  quantity: item.quantity,
                  item_id: item.item_id,
                };

                fetch("/server/rescuer/complete_offer.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    } else {

                    }
                  })
                  .catch((error) => console.error("Error:", error));
              });
              alert("Offer Complete");
              mapPanelRefresh();

              fetch("/server/rescuer/rescuer_geojson.php")
                .then((response) => response.json())
                .then((cargo) => {

                  truck_cargo(cargo);

                })
                .catch((error) => console.error("Error:", error))
            });

          });
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));


  fetch("/server/rescuer/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        if (data.categories.length !== 0 && data.items.length !== 0) {

          categories_select(data);
          var selected_cat = document.getElementById("categorySelect").value;
          items_select(data, selected_cat);
        } else {
          const list = document.getElementById("categorySelect");
          list.innerHTML = "";
          let select_add = document.createElement("option");
          select_add.textContent = "Η Βάση δεδομένων είναι κενή";
          list.appendChild(select_add);
        }
      }
    })
    .catch((error) => console.error("Error:", error));



});


function mapPanelRefresh() {

  var markersLayers = {};
  var geoJson;

  fetch('/server/rescuer/rescuer_geojson.php')
    .then(response => response.json())
    .then(data => {
      geoJson = data;
      map.removeControl(map_control);



      var layerSelected_tmp = {
        "Request Pending": false,
        "Request Accepted": false,
        "Offer Accepted": false,
        "Offer Pending": false,
        "Truck Active": false,
        "Truck Inactive": false,
        "Lines": false,
        "Base": false,
      };

      for (var key in layerSelected) {
        if (layerSelected.hasOwnProperty(key)) {
          layerSelected_tmp[key] = layerSelected[key];
        }
      }

      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      for (var key in layerSelected_tmp) {
        if (layerSelected_tmp.hasOwnProperty(key)) {
          layerSelected[key] = layerSelected_tmp[key];
        }
      }

      markersLayers["Lines"] = L.layerGroup();


      data.features.forEach((feature, index) => {
        const category = feature.properties.category;

        if (!markersLayers[category]) {
          markersLayers[category] = L.layerGroup();
        }

        var check = 0;

        data.features.forEach((features_check, index_check) => {
          if (features_check.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
            features_check.geometry.coordinates[1] === feature.geometry.coordinates[1] &&
            (category !== "Base" || category !== "Truck Active" || category !== "Truck Inactive") &&
            index !== index_check) {
            check = 1;
          }

        });

        const customMarkers = L.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
          icon: (function () {
            if (category === "Base") {
              return L.icon({
                iconUrl: '/leaflet/images/offices.png',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [0, -52],
              });
            } else if (category === "Request Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [2.5, -20]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [13, -35]
                });
              }
            } else if (category === "Request Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [15, -35]
                });
              }
            } else if (category === "Offer Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [20.5, 38],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-20, -35]
                });
              }
            } else if (category === "Offer Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-17, -35]
                });
              }
            } else if (category === "Truck Active") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-green.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            } else if (category === "Truck Inactive") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-red.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable:
            category === "Truck Active" ||
            category === "Truck Inactive",
          category: (function () {
            if (category === "Base") {
              return "Base";
            } else if (category === "Request Pending") {
              return "Request Pending";
            } else if (category === "Request Accepted") {
              return "Request Accepted";
            } else if (category === "Offer Accepted") {
              return "Offer Accepted";
            } else if (category === "Offer Pending") {
              return "Offer Pending";
            } else if (category === "Truck Active") {
              return "Truck Active";
            } else if (category === "Truck Inactive") {
              return "Truck Inactive";
            }
          })(),
          id: (function () {
            if (category === "Base") {
              return 1;
            } else if (category === "Request Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Request Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Truck Active") {
              return parseInt(feature.properties.vehicle_id);
            } else if (category === "Truck Inactive") {
              return parseInt(feature.properties.vehicle_id);
            }
          })(),
        });

        if (category === "Base") {

          customMarkers.bindPopup('<strong>Base</strong>');

        } else if (category === "Request Pending") {
          var requests = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
            <strong>Citizen</strong><br>
            <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
            <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
            ----------------------------------`;

          feature.properties.details.forEach((request) => {
            if (request.vehicle_id === null) {
              var info = `<br><strong>Request</strong><br>
              <strong>Submission date:</strong> ${request.submission_date}<br>
              <strong>Item:</strong> ${request.item_name}<br>
              <strong>Quantity:</strong> ${request.quantity}<br>
              <button id="${request.request_id}">Accept</button><br>
              ----------------------------------`;

            } else {
              var info = `<br><strong>Request</strong><br>
                <strong>Submission date:</strong> ${request.submission_date}<br>
                <strong>Item:</strong> ${request.item_name}<br>
                <strong>Quantity:</strong> ${request.quantity}<br>
                <strong>Pickup date:</strong> ${request.pickup_date}<br>
                <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
                ----------------------------------`;
            }
            info_citizen = info_citizen + info;
            requests.push(request.request_id);
          });


          info_citizen = info_citizen + `</div>`;


          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;



        } else if (category === "Request Accepted") {
          var requests = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
            <strong>Citizen</strong><br>
            <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
            <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
            ----------------------------------`;

          feature.properties.details.forEach((request) => {
            var info = `<br><strong>Request</strong><br>
              <strong>Submission date:</strong> ${request.submission_date}<br>
              <strong>Item:</strong> ${request.item_name}<br>
              <strong>Quantity:</strong> ${request.quantity}<br>
              <strong>Pickup date:</strong> ${request.pickup_date}<br>
              <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
              ----------------------------------`;
            info_citizen = info_citizen + info;
            requests.push(request.request_id);
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;
        } else if (category === "Offer Accepted") {
          var offers = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
            <strong>Citizen</strong><br>
            <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
            <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
            ----------------------------------`;

          feature.properties.details.forEach((offer) => {
            var info = `<br><strong>Offer</strong><br>
              <strong>Submission date:</strong> ${offer.submission_date}<br>
              <strong>Pickup date:</strong> ${offer.pickup_date}<br>
              <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

            offer.items.forEach((item) => {
              info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
                 <strong>Quantity:</strong> ${item.quantity}<br>`;
            });

            offers.push(offer.offer_id);
            info_citizen = info_citizen + info + ` ----------------------------------`;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;

        } else if (category === "Offer Pending") {
          var offers = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
              <strong>Citizen</strong><br>
              <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
              <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
              ----------------------------------`;


          feature.properties.details.forEach((offer) => {

            if (offer.vehicle_id === null) {
              var info = `<br><strong>Offer</strong><br>
                  <strong>Submission date:</strong> ${offer.submission_date}<br>`

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
                    <strong>Quantity:</strong> ${item.quantity}<br>`
              });

              info_citizen = info_citizen + info + ` <button id="${offer.offer_id}">Accept</button><br>`
                + ` ----------------------------------`;
              offers.push(offer.offer_id);
            } else {
              var info = `<br><strong>Offer</strong><br>
                  <strong>Submission date:</strong> ${offer.submission_date}<br>
                  <strong>Pickup date:</strong> ${offer.pickup_date}<br>
                  <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
                    <strong>Quantity:</strong> ${item.quantity}<br>`;
              });
              info_citizen = info_citizen + info + ` ----------------------------------`;
              offers.push(offer.offer_id);
            }
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;
        } else if (category === "Truck Active") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
            <strong>Truck</strong><br>
            <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
            <strong>Status:</strong> ${feature.properties.category}<br>
            ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
                <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
              info_truck = info_truck + info;
            });
          }

          feature.properties.requests.forEach((cargo) => {
            data.features.forEach((detail) => {

              if (detail.properties.category === "Request Pending" || detail.properties.category === "Request Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.request_id === cargo.request_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      request_id: id.request_id
                    }).addTo(markersLayers["Lines"]);
                  }
                });
              }
            });
          });

          feature.properties.offers.forEach((cargo) => {

            data.features.forEach((detail) => {
              if (detail.properties.category === "Offer Pending" || detail.properties.category === "Offer Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.offer_id === cargo.offer_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      offer_id: id.offer_id
                    }).addTo(markersLayers["Lines"]);

                  }
                });
              }

            });
          });

          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        } else if (category === "Truck Inactive") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
              <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
              info_truck = info_truck + info;
            });
          }
          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        }


        markersLayers[category].addLayer(customMarkers);

        if (layerSelected[category] === true) {
          markersLayers[category].addTo(map);
        }


        if (category === "Request Pending") {

          customMarkers.on('popupopen', function () {

            customMarkers.options.request_id.forEach(id => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Request Pending") {
                  feature.properties.details.forEach(detail => {
                    if (detail.request_id === id && detail.vehicle_id === null) {
                      document.getElementById(id).addEventListener('click', function () {
                        data.features.forEach(feature => {
                          if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                            if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                              const data = {
                                request: detail.request_id,
                              };

                              fetch("/server/rescuer/accept_request.php", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                              })
                                .then((response) => response.json())
                                .then((data) => {

                                  mapPanelRefresh();

                                })
                                .catch((error) => console.error("Error:", error));
                            } else {
                              alert("Τhe vehicle has the maximum tasks it can receive")
                            }
                          }
                        })
                      });
                    }
                  });
                }
              });
            });
          });
        } else if (category === "Offer Pending") {

          customMarkers.on('popupopen', function () {
            customMarkers.options.offer_id.forEach(id => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Offer Pending") {
                  feature.properties.details.forEach(detail => {
                    if (detail.offer_id === id && detail.vehicle_id === null) {
                      document.getElementById(id).addEventListener('click', function () {
                        data.features.forEach(feature => {
                          if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                            if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                              const data = {
                                offer: detail.offer_id,
                              };

                              fetch("/server/rescuer/accept_offer.php", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                              })
                                .then((response) => response.json())
                                .then((data) => {

                                  mapPanelRefresh();

                                })
                                .catch((error) => console.error("Error:", error));
                            } else {
                              alert("Τhe vehicle has the maximum tasks it can receive")
                            }
                          }
                        })
                      });
                    }
                  });
                }
              });
            });
          });
        }

        if (category === "Truck Active") {
          customMarkers.on('drag', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();


            markersLayers["Lines"].eachLayer(line => {
              const line_position = line.getLatLngs();
              const line_end1 = line_position[0].lat === feature.geometry.coordinates[0] && line_position[0].lng === feature.geometry.coordinates[1];
              const line_end2 = line_position[1].lat === feature.geometry.coordinates[0] && line_position[1].lng === feature.geometry.coordinates[1];

              if (line_end1 || line_end2) {
                let line_update;
                if (line_end1) {
                  line_update = [position.lat, position.lng];
                } else {
                  line_update = line_position[0];
                }

                if (line_end2) {
                  line.setLatLngs([
                    line_update,
                    [position.lat, position.lng]
                  ]);
                } else {
                  line.setLatLngs([
                    line_update,
                    line_position[1]
                  ]);
                }
              }
            });

            feature.geometry.coordinates[0] = position.lat;
            feature.geometry.coordinates[1] = position.lng;

          });

          customMarkers.on('dragend', function (event) {
            const marker = event.target;

            if (marker.options.category === "Truck Active") {
              const position = marker.getLatLng();

              const data = {
                id: marker.options.id,
                lat: position.lat,
                lng: position.lng,
              };

              fetch("/server/map_admin/truck_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(data => {

                })
                .catch((error) => console.error("Error:", error));
            }
          });

        }

        if (category === "Truck Inactive") {
          customMarkers.on('dragend', function (event) {
            const marker = event.target;

            if (marker.options.category === "Truck Inactive") {
              const position = marker.getLatLng();

              const data = {
                id: marker.options.id,
                lat: position.lat,
                lng: position.lng,
              };

              fetch("/server/map_admin/truck_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(data => {

                })
                .catch((error) => console.error("Error:", error));
            }
          });
        }

      });


      map.on('layerremove', function (event) {
        var removedLayer = event.layer;
        layerSelected[removedLayer.options.category] = false;

        if (removedLayer.options.category === "Request Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Request Accepted") {

          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Offer Accepted") {

          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Offer Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Truck Active") {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(request => {
                  if (request.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(request => {
                  if (request.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
        }
      });

      map.on('layeradd', function (event) {
        var addLayer = event.layer;

        if (addLayer.options.category === "Request Pending") {

          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }

          });

        } else if (addLayer.options.category === "Request Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Pending") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Truck Active") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(offer => {
                  if (offer.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
        } else if (addLayer.options.category === "Truck Inactive") {
          layerSelected[addLayer.options.category] = true;
        } else if (addLayer.options.category === "Lines") {
          layerSelected[addLayer.options.category] = true;
        }
      });

      if (layerSelected["Lines"] === true) {
        markersLayers["Lines"].addTo(map);

        if (layerSelected["Offer Pending"] === false) {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    data.features.forEach(cat => {
                      if (cat.properties.category === "Offer Pending") {
                        cat.properties.details.forEach(check_id => {
                          if (check_id.offer_id === offer.offer_id) {
                            line.setStyle({ opacity: 0 });
                          }

                        });
                      }
                    });
                  }
                })
              }
            })
          });
        }

        if (layerSelected["Offer Accepted"] === false) {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    data.features.forEach(cat => {
                      if (cat.properties.category === "Offer Accepted") {
                        cat.properties.details.forEach(check_id => {
                          if (check_id.offer_id === offer.offer_id) {
                            line.setStyle({ opacity: 0 });
                          }

                        });
                      }
                    });
                  }
                })
              }
            })
          });
        }


        if (layerSelected["Request Pending"] === false) {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(request => {
                  if (request.request_id === line.options.request_id) {
                    data.features.forEach(cat => {
                      if (cat.properties.category === "Request Pending") {
                        cat.properties.details.forEach(check_id => {
                          if (check_id.request_id === request.request_id) {
                            line.setStyle({ opacity: 0 });
                          }
                        });
                      }
                    });
                  }
                })
              }
            })
          });
        }

        if (layerSelected["Request Accepted"] === false) {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(request => {
                  if (request.request_id === line.options.request_id) {
                    data.features.forEach(cat => {
                      if (cat.properties.category === "Request Accepted") {
                        cat.properties.details.forEach(check_id => {
                          if (check_id.request_id === request.request_id) {
                            line.setStyle({ opacity: 0 });
                          }
                        });
                      }
                    });
                  }
                })
              }
            })
          });
        }
      }


      map_control = L.control.layers(null, markersLayers).addTo(map);

      truck_cargo(data);
      var distanceMarker;

      if ("Truck Active" in markersLayers) {
        markersLayers["Truck Active"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

          });
        })
      }

      if ("Truck Inactive" in markersLayers) {
        markersLayers["Truck Inactive"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

          });
        })
      }

      if (distanceMarker < 100) {
        document.getElementById("load").disabled = false;
        document.getElementById("unload").disabled = false;
      } else {
        document.getElementById("load").disabled = true;
        document.getElementById("unload").disabled = true;
      }

      if ("Truck Active" in markersLayers) {
        markersLayers["Truck Active"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            truck.on("drag", function () {
              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

              if (distanceMarker < 100) {
                document.getElementById("load").disabled = false;
                document.getElementById("unload").disabled = false;
              } else {
                document.getElementById("load").disabled = true;
                document.getElementById("unload").disabled = true;
              }
            });

          });
        })
      }

      if ("Truck Inactive" in markersLayers) {
        markersLayers["Truck Inactive"].eachLayer(truck => {

          markersLayers["Base"].eachLayer(Base => {

            truck.on("drag", function () {
              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

              if (distanceMarker < 100) {
                document.getElementById("load").disabled = false;
                document.getElementById("unload").disabled = false;
              } else {
                document.getElementById("load").disabled = true;
                document.getElementById("unload").disabled = true;
              }
            });

          });
        })
      }

      document.getElementById("tasks_info").innerHTML = "";

      fetch("/server/rescuer/rescuer_tasks.php")
        .then(response => response.json())
        .then(data => {

          const panel = document.getElementById("tasks_info");

          panel.innerHTML = "";

          data.requests.forEach(request => {
            const row_table = document.createElement("tr");
            const name = document.createElement("td");
            const phone_number = document.createElement("td");
            const type = document.createElement("td");
            const date = document.createElement("td");
            const item = document.createElement("td");
            const quantity = document.createElement("td");
            const action = document.createElement("td");

            name.textContent = request.citizen_name;
            phone_number.textContent = request.phone_number;
            type.textContent = "Request";
            const date_sub = request.submission_date.split(' ');
            date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
            item.textContent = request.item_name
            quantity.textContent = request.quantity;
            action.innerHTML = `
              <button id="request_${request.request_id}_accept">Complete</button>
              <button id="request_${request.request_id}_cancel">Cancel</button>`;

            row_table.appendChild(name);
            row_table.appendChild(phone_number);
            row_table.appendChild(type);
            row_table.appendChild(date);
            row_table.appendChild(item);
            row_table.appendChild(quantity);
            row_table.appendChild(action);
            panel.appendChild(row_table);

            document.getElementById(`request_${request.request_id}_cancel`).addEventListener("click", function () {

              const data = {
                id: request.request_id,
              };


              fetch("/server/rescuer/cancel_request.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  mapPanelRefresh();
                })
                .catch((error) => console.error("Error:", error));
            });

            var distanceMarker;

            if ("Request Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                  requestLayerPending.options.request_id.forEach(idCheck => {

                    if (idCheck === request.request_id) {
                      distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Request Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {

                  requestLayerAccepted.options.request_id.forEach(idCheck => {

                    if (idCheck === request.request_id) {
                      distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Request Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                    requestLayerPending.options.request_id.forEach(idCheck => {

                      if (idCheck === request.request_id) {
                        distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if ("Request Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {

                    requestLayerAccepted.options.request_id.forEach(idCheck => {

                      if (idCheck === request.request_id) {
                        distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if (distanceMarker > 50) {
              document.getElementById(`request_${request.request_id}_accept`).disabled = true;
            } else {
              document.getElementById(`request_${request.request_id}_accept`).disabled = false;
            }


            document.getElementById(`request_${request.request_id}_accept`).addEventListener("click", function () {

              var item_check = 0;
              var quantity_check = 0;
              var cargo_quantity;
              geoJson.features.forEach(features => {
                if (features.properties.category === "Truck Active") {
                  features.properties.cargo.forEach(cargo => {
                    if (cargo.item_id === request.item_id) {
                      item_check = 1;
                      cargo_quantity = cargo.quantity;
                      if (cargo.quantity >= request.quantity) {

                        quantity_check = 1;

                        const data = {
                          id: request.request_id,
                          quantity: request.quantity,
                          item_id: request.item_id,
                        };

                        console.log(data);

                        fetch("/server/rescuer/complete_request.php", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
                        })
                          .then((response) => response.json())
                          .then((data) => {
                            if (data.status === "error") {
                              console.error("Server Error:", data.Error);
                            } else {
                              alert("Request Complete");
                              mapPanelRefresh();

                              fetch("/server/rescuer/rescuer_geojson.php")
                                .then((response) => response.json())
                                .then((cargo) => {

                                  truck_cargo(cargo);

                                })
                                .catch((error) => console.error("Error:", error))
                            }
                          })
                          .catch((error) => console.error("Error:", error));

                      }
                    }
                  });
                }
              });

              if (item_check === 0) {
                alert(`The truck do not have the item ${request.item_name} to complete request`);
              } else if (quantity_check === 0) {
                alert(`The truck do not have the quantity of the item to complete request (Request: ${request.quantity}, Truck: ${cargo_quantity})`);
              }

            });
          });

          data.offers.forEach(offer => {
            const row_table = document.createElement("tr");
            const name = document.createElement("td");
            const phone_number = document.createElement("td");
            const type = document.createElement("td");
            const date = document.createElement("td");
            const item = document.createElement("td");
            const quantity = document.createElement("td");
            const action = document.createElement("td");

            name.textContent = offer.citizen_name;
            phone_number.textContent = offer.phone_number;
            type.textContent = "Offer";
            const date_sub = offer.submission_date.split(' ');

            date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
            action.innerHTML = `
              <button id="offer_${offer.offer_id}_accept">Complete</button>
              <button id="offer_${offer.offer_id}_cancel">Cancel</button>`;

            var items_name_array = [];
            var items_quantity_array = [];
            offer.items.forEach(items => {
              items_name_array.push(items.item_name);
              items_quantity_array.push(items.quantity);
            })

            item.innerHTML = items_name_array.join("<br>");
            quantity.innerHTML = items_quantity_array.join("<br>");

            row_table.appendChild(name);
            row_table.appendChild(phone_number);
            row_table.appendChild(type);
            row_table.appendChild(date);
            row_table.appendChild(item);
            row_table.appendChild(quantity);
            row_table.appendChild(action);

            panel.appendChild(row_table);

            document.getElementById(`offer_${offer.offer_id}_cancel`).addEventListener("click", function () {

              const data = {
                id: offer.offer_id,
              };

              fetch("/server/rescuer/cancel_offer.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {

                  mapPanelRefresh();

                })
                .catch((error) => console.error("Error:", error));
            });


            var distanceMarker;

            if ("Offer Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                  offerLayerPending.options.offer_id.forEach(idCheck => {

                    if (idCheck === offer.offer_id) {
                      distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Offer Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                  offerLayerAccepted.options.offer_id.forEach(idCheck => {

                    if (idCheck === offer.offer_id) {
                      distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                    }
                  });
                })
              });
            }

            if ("Offer Pending" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                    offerLayerPending.options.offer_id.forEach(idCheck => {

                      if (idCheck === offer.offer_id) {
                        distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if ("Offer Accepted" in markersLayers) {
              markersLayers["Truck Active"].eachLayer(layer => {

                layer.on("drag", function () {

                  markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                    offerLayerAccepted.options.offer_id.forEach(idCheck => {

                      if (idCheck === offer.offer_id) {
                        distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                      }
                      if (distanceMarker > 50) {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                      } else {
                        document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                      }
                    });
                  })
                });
              });
            }

            if (distanceMarker > 50) {
              document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
            } else {
              document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
            }


            document.getElementById(`offer_${offer.offer_id}_accept`).addEventListener("click", function () {


              offer.items.forEach(item => {

                const data = {
                  id: offer.offer_id,
                  quantity: item.quantity,
                  item_id: item.item_id,
                };

                fetch("/server/rescuer/complete_offer.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    } else {

                    }
                  })
                  .catch((error) => console.error("Error:", error));
              });
              alert("Offer Complete");
              mapPanelRefresh();

              fetch("/server/rescuer/rescuer_geojson.php")
                .then((response) => response.json())
                .then((cargo) => {

                  truck_cargo(cargo);

                })
                .catch((error) => console.error("Error:", error))
            });
          });
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));

}

function categories_select(data) {
  const list = document.getElementById("categorySelect");

  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

function items_select(data, selected_cat) {
  const table = document.getElementById("items");

  table.innerHTML = "";

  data.items.forEach((item) => {
    if (item.name != "" && item.category === selected_cat) {
      if (item.quantity > 0) {
        const row_table = document.createElement("tr");
        const id_table = document.createElement("td");
        const name_table = document.createElement("td");
        const category_table = document.createElement("td");
        const detail_table = document.createElement("td");
        const item_quantity = document.createElement("td");

        id_table.textContent = item.id;
        name_table.textContent = item.name;
        item_quantity.textContent = item.quantity;
        const category = data.categories.find((category) =>
          category.id === item.category
        );
        category_table.textContent = category.category_name;

        const detail_get = item.details.map((detail) => {
          if (detail.detail_name && detail.detail_value) {
            return `${detail.detail_name}: ${detail.detail_value}`;
          } else if (detail.detail_name && detail.detail_value === "") {
            return `${detail.detail_name}:`;
          } else if (detail.detail_name === "" && detail.detail_value) {
            return `---: ${detail.detail_value}`;
          } else {
            return " ";
          }
        });
        detail_table.innerHTML = detail_get.join("<br>");

        row_table.appendChild(id_table);
        row_table.appendChild(name_table);
        row_table.appendChild(category_table);
        row_table.appendChild(detail_table);
        row_table.appendChild(item_quantity);

        table.appendChild(row_table);
      }
    }
  });
}

function truck_cargo(data) {

  const truck_table = document.getElementById("itemCargo");
  truck_table.innerHTML = "";
  data.features.forEach(feature => {
    if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
      feature.properties.cargo.forEach(item => {
        const row_table = document.createElement("tr");
        const id_table = document.createElement("td");
        const name_table = document.createElement("td");
        const item_quantity = document.createElement("td");

        id_table.textContent = item.item_id;
        name_table.textContent = item.item_name;
        item_quantity.textContent = item.quantity;

        row_table.appendChild(id_table);
        row_table.appendChild(name_table);
        row_table.appendChild(item_quantity);

        truck_table.appendChild(row_table);
      });
    }
  });

}

document.getElementById("tableOfItems").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(
      (cell) => cell.textContent
    );
    const id = row_items[0];
    const item = row_items[1];
    const quantity = row_items[4];

    const table = document.getElementById("itemSelected");
    var flag = 0;
    var item_check = [];


    for (var i = 0; i < table.rows.length; i++) {
      var cell = table.rows[i].cells[0];
      item_check.push(cell.innerText);
    }

    for (var i = 0; i < item_check.length; i++) {
      if (item_check[i] === id) {
        flag = 1;
        break;
      }
    }

    if (flag === 0) {
      const row_table = document.createElement("tr");
      const item_id = document.createElement("td");
      const name_table = document.createElement("td");
      const item_quantity = document.createElement("td");
      const item_delete = document.createElement("td");

      item_id.textContent = id;
      name_table.textContent = item;
      item_quantity.innerHTML = `<input type="range" id="${id}" 
      min="0" max="${quantity}" value="0"></input><span id="quantity_${id}">0</span>`;
      item_delete.innerHTML = `<button id=cancel_${id}>cancel</button>`;

      row_table.appendChild(item_id);
      row_table.appendChild(name_table);
      row_table.appendChild(item_quantity);
      row_table.appendChild(item_delete);

      table.appendChild(row_table);

      document.getElementById(`${id}`).addEventListener("input", function () {
        document.getElementById(`quantity_${id}`).innerText = this.value;
      });

      document.getElementById(`cancel_${id}`).addEventListener("click", function () {
        var row = this.closest('tr');
        row.parentNode.removeChild(row);
      });
    }
  }
});

document.getElementById("load").addEventListener("click", function () {

  var selectTable = document.getElementById('itemSelected');
  var flag = 0;


  if (selectTable.rows.length > 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (parseInt(document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText) === 0) {
        flag = 1;

        alert(`Select a quantity over 0 for item: ${selectTable.rows[i].cells[1].innerHTML}`)
      }
    }
  } else {
    flag = 1;
    alert("Select at least one item to load on truck");
  }


  if (flag === 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText > 0) {


        const data = {
          id: selectTable.rows[i].cells[0].innerHTML,
          quantity: document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText,
        };

        fetch("/server/rescuer/load_truck.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {
              fetch("/server/rescuer/database_extract.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {

                    var selected_cat = document.getElementById("categorySelect").value;
                    items_select(data, selected_cat);
                    document.getElementById("itemSelected").innerHTML = "";
                  }
                })
                .catch((error) => console.error("Error:", error));

              fetch("/server/rescuer/rescuer_geojson.php")
                .then((response) => response.json())
                .then((cargo) => {

                  truck_cargo(cargo);

                })
                .catch((error) => console.error("Error:", error))
            }
          })
          .catch((error) => console.error("Error:", error));

      }
    }
    mapPanelRefresh();
  }
});

document.getElementById("unload").addEventListener("click", function () {

  var itemTable = document.getElementById('itemCargo');

  if (itemTable.rows.length > 0) {

    fetch("/server/rescuer/unload_truck.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "error") {
          console.error("Server Error:", data.Error);
        } else {
          fetch("/server/rescuer/database_extract.php")
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "error") {
                console.error("Server Error:", data.Error);
              } else {

                var selected_cat = document.getElementById("categorySelect").value;
                items_select(data, selected_cat);
                document.getElementById("itemCargo").innerHTML = "";
              }
            })
            .catch((error) => console.error("Error:", error));

          fetch("/server/rescuer/rescuer_geojson.php")
            .then((response) => response.json())
            .then((cargo) => {
              truck_cargo(cargo);

            })
            .catch((error) => console.error("Error:", error))
        }
      })
      .catch((error) => console.error("Error:", error));

    mapPanelRefresh();

  } else {
    alert("The truck is empty");
  }


});

document.getElementById("categorySelect").addEventListener("change", function () {
  fetch("/server/rescuer/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        const selected_cat = document.getElementById("categorySelect").value;
        items_select(data, selected_cat);
      }
    })
    .catch((error) => console.error("Error:", error));
});