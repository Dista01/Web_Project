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
  <title>Requests</title>
  <link rel="stylesheet" href="/css/citizen_offers.css">
  <link rel="stylesheet" href="/css/general.css">
</head>

<body>
<div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Προσφορές</h1>
      </div>
      <div class="topBar">
    <a href="/html/citizen/citizen_requests.php">Αιτήματα</a>
    <a href="/server/logout.php">Αποσύνδεση</a>
    </div>
    </div>
  </div>
 

  <div id="tables">
  <h2> Ανακοινώσεις </h2>
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
    <h3>Επίλογη Προσφοράς </h3>
    <div id="offer_select_container">
      <table id="tableSelectedOffer">
        <thead>
          <tr>
            <th>ID</th>
            <th>'Ονομα Προϊόντος</th>
            <th>Ποσότητα</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="OfferSelected"></tbody>
      </table>
    </div>
    <div>
      <button id="clear">Αφαίρεση</button>
      <button id="submitAnnouncement">Καταχώρηση</button>
      </div>
      <h4>Αποδοχή Προσφοράς</h4>
    <div id="offers_t">
      <table id="table_offers">
        <thead>
          <tr>
            <th>Προϊόν</th>
            <th>Ποσότητα</th>
            <th>Ημερομηνία Καταχώρησης</th>
            <th>Ημερομηνία Παραλαβής</th>
            <th>Ημερομηνία Ολοκλήρωσης</th>
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