<?php
include("../Mysql_connection.php");


$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try {

  $update_stmt = $db->prepare("UPDATE item_details SET item_detail_name
  =?, item_detail_value=? where item_detail_id=?
  and item_detail_name=? and item_detail_value=?");

  $update_stmt->bind_param(
    "ssiss",
    $data->new_name,
    $data->new_value,
    $data->id,
    $data->prev_product_name,
    $data->prev_product_value
  );

  $update_stmt->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', "Error: " . $error->getMessage()]);
}

?>