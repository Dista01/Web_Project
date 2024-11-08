<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "admin") {
  header("Location: /html/login.php");
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/admin_HomePage.css">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
  <title>Αρχική</title>
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Διαχειριστής</h1>
      </div>
      <div class="topBar">
      <div><p id="text"></p></div>
        <div class="topButton"><a href="/html/admin/Announcements">Ανακοινώσεις</a></div>
        <div class="topButton"><a href="/html/admin/RegisterRescuer">Εγγραφή Διασώστη</a></div>
        <div class="topButton"><a href="/html/admin/BaseWarehouse">Αποθήκη</a></div>
        <div class="topButton"><a href="/server/logout">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>

  <div class="container">
    <div id="map"></div>
    <hr class="separator-line">
    <hr class="separator-line">
    <div class="chart-container">
      <div id=title_chart>
        <h2 class="chart-heading">Κατάσταση προσφορών και αιτημάτων</h2>
      </div>
      <div class="charts">
        <label for="startdate">Ημερομηνία έναρξης:</label>
        <input type="date" id="startdate" name="selectedDate" required>
        <br>
        <label for="enddate">Ημερομηνία τερματισμού:</label>
        <input type="date" id="enddate" name="selectedDate" required>
        <button id="submitdate">Καταχώρηση</button>
      </div>
      <canvas id="serverchart" width="500" height="50"></canvas>

    </div>

  </div>


  <script src="/scripts/adminHomePage.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/leaflet/leaflet.js"></script>
</body>

</html>