<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "citizen") {
  header("Location: /html/login.php");
  exit();
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Προσφορές</title>
  <link rel="stylesheet" href="/css/citizen_offers.css">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header-title">
        <h1 class="page-title">Προσφορές</h1>
      </div>
      <div class="topBar">
        <div>
          <p id="text"></p>
        </div>
        <div class="topButton"><a href="/html/citizen/Requests">Αιτήματα</a></div>
        <div class="topButton"><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>


  <div id="main_container">
    <div id="table_start">
      <h1> Ανακοινώσεις</h1>
      <div id="tableAnnouncements-container">
        <table id="tableAnnouncements">
          <thead>
            <tr>
              <th>Eπιλογή</th>
              <th>ID</th>
              <th>'Ονομα Προϊόντος</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="announcements"></tbody>
        </table>
      </div>
    </div>


    <div id="table_start">
      <h1>Επίλογη Προσφοράς</h1>
      <div id="offer_select_container">
        <table id="tableSelectedOffer">
          <thead>
            <tr>
              <th>ID</th>
              <th>'Ονομα Προϊόντος</th>
              <th>Ποσότητα</th>
              <th>Eπιλογή</th>
            </tr>
          </thead>
          <tbody id="OfferSelected"></tbody>
        </table>
      </div>
      <div id="button-container">
        <button id="submitOffer">Καταχώρηση</button>
        <button id="clear">Αφαίρεση</button>
      </div>
    </div>


    <div id="table_start">
      <h1>Προσφορές</h1>
      <div id="offers_t">
        <table id="table_offers">
          <thead>
            <tr>
              <th>Προϊόν</th>
              <th>Ποσότητα</th>
              <th>Ημερομηνία Καταχώρησης</th>
              <th>Ημερομηνία Αποδοχής</th>
              <th>Ημερομηνία Ολοκλήρωσης</th>
              <th>Ακύρωση</th>
            </tr>
          </thead>
          <tbody id="offers"></tbody>
        </table>
      </div>
    </div>
  </div>


  <script src="/scripts/citizen_offers.js"></script>
</body>

</html>