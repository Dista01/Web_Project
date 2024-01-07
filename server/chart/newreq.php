<?php

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {
  $db = db_connect();

  $new_request_count = $db->prepare("SELECT COUNT(*) AS plithos FROM citizen_requests WHERE req_veh_id IS NULL AND submission_date BETWEEN ? AND ?");
  $new_request_count -> bind_param(
  "ss",
  $data->startdate,
  $data->enddate,
  );
  $new_request_count->execute();
  $new_request_response = $new_request_count->get_result();

  $new_request;
  
  if ($new_request_response->num_rows > 0) {
      $new_request_row = $new_request_response->fetch_assoc();
      $request_array["plithos"] = $new_request_row["plithos"];
      $new_request = $request_array;
    }


  $selected_request_count = $db->prepare("SELECT COUNT(*) AS plithos FROM citizen_requests WHERE req_veh_id IS NOT NULL AND pickup_date BETWEEN ? AND ?");
  $selected_request_count -> bind_param(
    "ss",
    $data->startdate,
    $data->enddate,

  );
  $selected_request_count->execute();
  $selected_request_response = $selected_request_count->get_result();

  $selected_request;

  if ($selected_request_response->num_rows > 0) {

      $selected_request_row = $selected_request_response->fetch_assoc();
      $request_array["plithos"] = $selected_request_row["plithos"];
      $selected_request = $request_array;
    }
  

  $complete_request_count = $db->prepare("SELECT COUNT(*) AS plithos FROM citizen_requests_complete WHERE complete_date BETWEEN ? AND ?");
  $complete_request_count -> bind_param(
    "ss",
    $data->startdate,
    $data->enddate,

  );
  $complete_request_count->execute();
  $complete_request_response = $complete_request_count->get_result();

  $complete_request;

  if ($complete_request_response->num_rows > 0) {

      $complete_request_row = $complete_request_response->fetch_assoc();
      $request_array["plithos"] = $complete_request_row["plithos"];
      $complete_request = $request_array;
    
  }


  $new_offer_count = $db->prepare("SELECT COUNT(*) AS plithos FROM citizen_offers WHERE offer_veh_id IS NULL AND submission_date BETWEEN ? AND ?");
  $new_offer_count -> bind_param(
  "ss",
  $data->startdate,
  $data->enddate,
  );
  $new_offer_count->execute();
  $new_offer_response = $new_offer_count->get_result();

  $new_offer;
  
  if ($new_offer_response->num_rows > 0) {
      $new_offer_row = $new_offer_response->fetch_assoc();
      $request_array["plithos"] = $new_offer_row["plithos"];
      $new_offer = $request_array;
    }


    $complete_offer_count = $db->prepare("SELECT COUNT(*) AS plithos FROM citizen_offers_complete WHERE pickup_date BETWEEN ? AND ?");
    $complete_offer_count -> bind_param(
      "ss",
      $data->startdate,
      $data->enddate,
  
    );
    $complete_offer_count->execute();
    $complete_offer_response = $complete_offer_count->get_result();
  
    $complete_offer;
  
    if ($complete_offer_response->num_rows > 0) {
  
        $complete_offer_row = $complete_offer_response->fetch_assoc();
        $request_array["plithos"] = $complete_offer_row["plithos"];
        $complete_offer = $request_array;
      
    }




  $data_chart = array(
    "new_request" => $new_request,
    "selected_request" => $selected_request,
    "complete_request" => $complete_request,
    "new_offer" => $new_offer,
    "complete_offer" => $complete_offer,
  );


  $db->close();

  $json_data = json_encode($data_chart);

  header('Content-Type: application/json');

  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}

?>