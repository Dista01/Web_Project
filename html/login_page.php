<?php
session_start();

if (isset($_SESSION['username'])) {
  if ($_SESSION['type'] == "rescuer") {
    header("Location: /html/rescuer/rescuer_map.php");
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
  <link rel="stylesheet" href="/css/login_style.css">
  <title>Login</title>
</head>

<body>
  <div id="loginbox">
    <img src="/images/loginuser.png" alt="Login image" id="loginuser">
    <h1>Login</h1>
    <form id="loginForm" action="/server/loginpage/login_page.php" method="post">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>

      <input type="checkbox" id="check">
      <label for="check">Show password</label>

      <div id="register">
        <p>Don't have an account?
          <a href="/html/register_page"><br><strong>Register</strong></a>
        </p>
      </div>

      <button type="button" id="loginButton">Login</button>
    </form>
  </div>

  <script src="/scripts/login_Script.js"></script>
</body>