<?php
session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

$vehicle_task_update = $db->prepare("INSERT INTO vehicle_tasks values (?,NULL,?)");
$vehicle_task_update->bind_param(
  "ii",
  $_SESSION["truck_id"],
  $data->request,
);
$vehicle_task_update->execute();

$citizen_request_update = $db->prepare("UPDATE citizen_offers SET pickup_date=now(), offer_veh_id=?
where offer_id=?");
$citizen_request_update->bind_param(
"ii",
$_SESSION["truck_id"],
$data->offer,
);
$citizen_request_update->execute();

$db->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'success']);