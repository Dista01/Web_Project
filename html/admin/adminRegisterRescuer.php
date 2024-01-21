<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "admin") {
  header("Location: /html/login.php");
  exit();
}
?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width initial-scale=1">
  <title>Rescuer Register</title>
  <link rel="stylesheet" href="/css/register_rescuer.css">
</head>

<body>

  <body>
    <div class="registerbox" id="registerbox">
      <h1>Register Rescuer</h1>
      <form id="registerForm">
        <div class="fnameBox">
          <label for="fname">First Name</label>
          <input type="text" id="fname" placeholder="Enter First Name" maxlength="12" required>
        </div>
        <div class="lnameBox">
          <label for="lname">Last Name</label>
          <input type="text" id="lname" placeholder="Enter Last Name" maxlength="12" required>
        </div>
        <div class="userBox">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Enter Username" maxlength="12" required>
        </div>
        <div class="passBox">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="Enter password" required>
        </div>
        <div class="passBox">
          <label for="confpassword">Confirm Password</label>
          <input type="password" id="confpassword" placeholder="Re-Enter password" required>
        </div>
        <div>
          <label for="vehicleSelect">Επέλεξε ένα όχημα</label>
          <select id="vehicleSelect">
          </select>
        </div>
        <div>
          <label for="newVehicle">Πρόσθεσαι τον σε νέο όχημα:</label>
          <input type="checkbox" id="newVehicle">
        </div>
        <div>
          <label for="vehicleUsername">Username</label>
          <input type="text" id="vehicleUsername" disabled>
        </div>
        <div>
        <div>
          <button type="button" id="registerButton"><strong>REGISTER</strong></button>
        </div>
        </div>
      </form>

  </body>
  <script src="/scripts/admin_register_rescuer.js"></script>
</html>