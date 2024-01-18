<?php

session_start();

include("Mysql_connection.php");

try {

  $db = db_connect();

  if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = $_POST['f_name'];
    $last_name = $_POST["l_name"];
    $phone_number = $_POST["phone_number"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $location = $_POST["location"];

    $phoneCheck = false;
    $usernameCheck = false;

    $usernameCheckSql = $db->prepare("SELECT username from users where username=?");
    $usernameCheckSql->bind_param("s", $username);
    $usernameCheckSql->execute();
    $usernameCheckSql_response = $usernameCheckSql->get_result();

    if ($usernameCheckSql_response->num_rows > 0) {
      $usernameCheck = true;
    }

    $phoneCheckSql = $db->prepare("SELECT phone_number from citizen where phone_number=?");
    $phoneCheckSql->bind_param("s", $phone_number);
    $phoneCheckSql->execute();
    $phoneCheckSql_response = $phoneCheckSql->get_result();



    if ($phoneCheckSql_response->num_rows > 0) {
      $phoneCheck = true;
    }

    if ($usernameCheck == true && $phoneCheck == false) {
      $response = ["status" => "fail", "message" => "Το username υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == false && $phoneCheck == true) {
      $response = ["status" => "fail", "message" => "Ο αριθμός τηλεφώνου υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == true && $phoneCheck == true) {
      $response = ["status" => "fail", "message" => "Ο αριθμός τηλεφώνου και το username υπάρχουν ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == false && $phoneCheck == false) {

      $insert_user = $db->prepare("INSERT INTO users VALUES
      (NULL,?,?,?)");
      $insert_user->bind_param("sss", $username, $password,"citizen");
      $insert_user->execute();

      $user_id = "SELECT LAST_INSERT_ID() as user_id";
      $user_id_responce =  $db->query($user_id);
      $user_id_row = $user_id_responce->fetch_assoc();

      $insert_citizen = $db->prepare("INSERT INTO citizen VALUES
      (?,?,?,?,?,?)");
      $insert_citizen->bind_param(
        "isssss",
        $user_id_row["user_id"],
        $first_name,
        $last_name,
        $phone_number,
        $location->latitude,
        $location->longitude,
      );
      $insert_citizen->execute();

      $_SESSION["type"] = "citizen";
      $_SESSION["username"] = $username;
      $_SESSION["user_id"]=$user_id_row["user_id"];
      $_SESSION["Name"] = $first_name . " " . $last_name;
      $response = ["status" => "success", "Location" => "/html/citizen/citizen_requests"];
      header("Content-Type: application/json");
      echo json_encode($response);
    }else{
      $response = ["status" => "fail","message" => "Error"];
      header("Content-Type: application/json");
      echo json_encode($response);
    }
  }
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'fail', "message" => $error->getMessage()]);
}
