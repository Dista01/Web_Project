<?php

//PHP script που στέλνει στον client
//όλες τις προσφορές του πολίτη

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την δημιουργία JSON με τις προσφορές
  //του πολίτη
  $offer_citizen = $db->prepare("SELECT * FROM citizen_offers where
  offer_citizen_id=?");
  $offer_citizen->bind_param("i", $_SESSION["user_id"]);
  $offer_citizen->execute();
  $offer_response = $offer_citizen->get_result();

  $offer = array();

  if ($offer_response->num_rows > 0) {
    while ($offer_row = $offer_response->fetch_assoc()) {
      $offer_task_array = array(
        "offer_id" => $offer_row["offer_id"],
        "submission_date" => $offer_row["submission_date"],
        "pickup_date" => $offer_row["pickup_date"],
        "citizen_id" => $offer_row["offer_citizen_id"],
        "offer_veh_id" => $offer_row["offer_veh_id"],
        "announcement_id" => $offer_row["announcement_id"],
      );

      if ($offer_row["offer_veh_id"] != NULL) {
        $vehicle = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $vehicle->bind_param("i", $offer_row["offer_veh_id"]);
        $vehicle->execute();
        $vehicle_response = $vehicle->get_result();
        $vehicle_row = $vehicle_response->fetch_assoc();
        $offer_task_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      } else {
        $offer_task_array["vehicle_username"] = NULL;
      }

      $items = $db->prepare("SELECT * FROM offer_items WHERE offer_id_item=?");
      $items->bind_param("i", $offer_row["offer_id"]);
      $items->execute();
      $items_response = $items->get_result();

      $items = array();

      while ($items_row = $items_response->fetch_assoc()) {
        $item = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item->bind_param("i", $items_row["item_id_offer"]);
        $item->execute();
        $item_response = $item->get_result();
        $item_row = $item_response->fetch_assoc();

        $item_array = array(
          "item_name" => $item_row["item_name"],
          "item_id" => $items_row["item_id_offer"],
          "quantity" => $items_row["quantity"],
        );
        
        $items[]=$item_array;
      }

      $offer_task_array["items"]=$items;
      $offer[] = $offer_task_array;
    }
  }

  $offer_citizen = $db->prepare("SELECT * FROM citizen_offers_complete where
  offer_citizen_id=?");
  $offer_citizen->bind_param("i", $_SESSION["user_id"]);
  $offer_citizen->execute();
  $offer_response = $offer_citizen->get_result();

  if ($offer_response->num_rows > 0) {
    while ($offer_row = $offer_response->fetch_assoc()) {
      $offer_task_array = array(
        "offer_id" => $offer_row["offer_id"],
        "submission_date" => $offer_row["submission_date"],
        "pickup_date" => $offer_row["pickup_date"],
        "citizen_id" => $offer_row["offer_citizen_id"],
        "offer_veh_id" => $offer_row["offer_veh_id"],
        "complete_date" => $offer_row["complete_date"],
      );

      if ($offer_row["offer_veh_id"] != NULL) {
        $vehicle = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $vehicle->bind_param("i", $offer_row["offer_veh_id"]);
        $vehicle->execute();
        $vehicle_response = $vehicle->get_result();
        $vehicle_row = $vehicle_response->fetch_assoc();
        $offer_task_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      } else {
        $offer_task_array["vehicle_username"] = NULL;
      }

      $items = $db->prepare("SELECT * FROM offer_items WHERE offer_id_item=?");
      $items->bind_param("i", $offer_row["offer_id"]);
      $items->execute();
      $items_response = $items->get_result();

      $items = array();

      while ($items_row = $items_response->fetch_assoc()) {
        $item = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item->bind_param("i", $items_row["item_id_offer"]);
        $item->execute();
        $item_response = $item->get_result();
        $item_row = $item_response->fetch_assoc();

        $item_array = array(
          "item_name" => $item_row["item_name"],
          "item_id" => $items_row["item_id_offer"],
          "quantity" => $items_row["quantity"],
        );
        
        $items[]=$item_array;
      }

      $offer_task_array["items"]=$items;
      $offer[] = $offer_task_array;
    }
  }


  $data = $offer;

  //Αποστολή του JSON στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
