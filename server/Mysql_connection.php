<?php

//PHP script που διαχειρίζεται την σύνδεση
//με την βάση δεδομένων

function db_connect()
{

  $name = "localhost";
  $user = "root";
  $password = "2002";

  $database_name = "web";

  //Δημιουργία σύνδεσης
  $db = new mysqli($name, $user, $password, $database_name);

  if ($db->connect_error) {
    die("Connection Error: " . $db->connect_error);
  }

  return $db;
}
