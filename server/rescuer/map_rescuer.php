<?php

session_start();

include("../Mysql_connection.php");

$db = db_connect();
$features = array();

$mysql = "SELECT DISTINCT req_citizen_id FROM citizen_requests;";
$response = $db->query($mysql);
$check = 0;

if ($response->num_rows > 0) {
  while ($requests_row = $response->fetch_assoc()) {

    $check = 0;
    $citizen_info = $db->prepare("SELECT f_name,l_name,phone_number,latitude,longitude FROM citizen
    where citizen_id=?");
    $citizen_info->bind_param("i", $requests_row["req_citizen_id"]);
    $citizen_info->execute();
    $citizen_response = $citizen_info->get_result();
    $citizen_row = $citizen_response->fetch_assoc();

    $citizen_data["citizen_id"] = $requests_row["req_citizen_id"];
    $citizen_data["first_name"] = $citizen_row["f_name"];
    $citizen_data["last_name"] = $citizen_row["l_name"];
    $citizen_data["phone_number"] = $citizen_row["phone_number"];
    $location["latitude"] = $citizen_row["latitude"];
    $location["longitude"] = $citizen_row["longitude"];

    $coordinates = array((float)$location["latitude"], (float)$location["longitude"]);
    $geometry = array(
      "type" => "Point",
      "coordinates" => $coordinates
    );

    $request_citizen = $db->prepare("SELECT * FROM citizen_requests where req_citizen_id=?");
    $request_citizen->bind_param("i", $requests_row["req_citizen_id"]);
    $request_citizen->execute();
    $requests_response  = $request_citizen->get_result();

    $requests_details = array();

    while ($citizen_request_row = $requests_response->fetch_assoc()) {

      if ($citizen_request_row["req_veh_id"] == null || $citizen_request_row["req_veh_id"] == $_SESSION["truck_id"]) {

        $request_array = array(
          "request_id" => $citizen_request_row["request_id"],
          "submission_date" => $citizen_request_row["submission_date"],
          "quantity" => $citizen_request_row["persons"],
          "pickup_date" => $citizen_request_row["pickup_date"],
          "vehicle_id" => $citizen_request_row["req_veh_id"],
          "citizen_id" => $citizen_request_row["req_citizen_id"],
          "item_id" => $citizen_request_row["req_item_id"]
        );

        $item_info = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item_info->bind_param("i", $request_array["item_id"]);
        $item_info->execute();
        $item_rensponse = $item_info->get_result();
        $item_row = $item_rensponse->fetch_assoc();
        $request_array["item_name"] = $item_row["item_name"];

        if ($citizen_request_row["req_veh_id"] != null) {
          $vehicle_info = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
          $vehicle_info->bind_param("i", $request_array["vehicle_id"]);
          $vehicle_info->execute();
          $vehicle_rensponse = $vehicle_info->get_result();
          $vehicle_row = $vehicle_rensponse->fetch_assoc();
          $request_array["vehicle_username"] = $vehicle_row["vehicle_username"];
        } else {
          $request_array["vehicle_username"] = null;
        }


        if ($citizen_request_row["req_veh_id"] == null) {
          $check = 1;
        }

        $requests_details[] = $request_array;


        if ($check == 1) {
          $citizen_data["category"] = "Request Pending";
        } else {
          $citizen_data["category"] = "Request Accepted";
        }


        $citizen_data["details"] = $requests_details;



      }
    }
    $feature = array(
      "type" => "Feature",
      "geometry" => $geometry,
      "properties" => $citizen_data,
    );

    $features[] = $feature;
  }
}


$featureCollection = array(
  "type" => "FeatureCollection",
  "features" => $features,
);


header('Content-Type: application/json');
echo json_encode($featureCollection);