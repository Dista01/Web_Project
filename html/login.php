<?php

session_start();

if (isset($_SESSION['type'])) {
  if ($_SESSION['type'] == "rescuer") {
    header("Location: /html/rescuer/HomePage");
    exit();
  } else if ($_SESSION['type'] == "citizen") {
    header("Location: /html/citizen/Requests");
    exit();
  } else if ($_SESSION['type'] == "admin") {
    header("Location: /html/admin/HomePage");
    exit();
  }

  exit();
}

?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width initial-scale=1">
  <link rel="stylesheet" href="/css/login.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
  <title>Σύνδεση</title>
</head>

<body>
  <div class="loginbox">
    <img src="/images/loginuser.png" alt="Login image" id="userImage">
    <h1>Σύνδεση</h1>
    <form id="loginForm">
      <div id="userInputs">
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Εισαγωγή Username" name="username" autocomplete="username" required>

        <label for="password">Κωδικός</label>
        <input type="password" id="password" placeholder="Εισαγωγή Κωδικού" name="password" required>
      </div>
      <div class="checkbox-container">
        <input type="checkbox" id="check">
        <label for="check">Εμφάνιση κωδικού</label>
      </div>

      <div id="register">
        <p>Δεν έχεις λογαριασμό?
          <br>
          <a href="/html/register"><strong>Εγγραφή</strong></a>
        </p>
      </div>

      <button type="button" id="loginButton">Σύνδεση</button>
    </form>
  </div>

  <script src="/scripts/login_script.js"></script>
</body>

</html>