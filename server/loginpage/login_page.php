<?php

include("../Mysql_connection.php");

$db = db_connect();
try{
    $username = $_GET['username'];
    $password = $_GET['pass'];
    
$mysql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$response = $db->query($mysql);

$loginpage = array();



if ($response->num_rows > 0) {
        
        echo "Login successful!";
    } else {
        // Invalid login
        echo "Invalid login credentials";
    }
if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $loginpage_array = array(
      "user_id" => $row["user_id"],
      "username" => $row["username"],
      "password" => $row["password"],
      "user_type" => $row["user_type"]
    );

    $loginpage[] = $loginpage_array;
  }
}


$data = array(
  "loginpage" => $loginpage,
);


$db->close();

$json_data = json_encode($data);

header('Content-Type: application/json');

echo $json_data;
}

catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}

?>