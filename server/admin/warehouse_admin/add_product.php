<?php

session_start();
include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try {
$add_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?,0)");

$add_stmt->bind_param(
  "isi",
  $data->id,
  $data->name,
  $data->category
);
$add_stmt->execute();
$add_stmt->close();

$db->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'success']);
} catch (Exception $error) {
header('Content-Type: application/json');
echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}

?>