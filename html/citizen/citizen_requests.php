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
  <link rel="stylesheet" href="/css/citizen_requests.css">
  <link rel="stylesheet" href="/css/general.css">
  <title>Requests</title>
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="side_header">
      <div class="header">
        <h1 class="page-title">Αιτήματα</h1>
      </div>
      <div class="sidebar">
        <a href="/html/citizen/citizen_offers.php">Προσφορές</a>
        <a href="/server/logout.php">Αποσύνδεση</a>
      </div>
    </div>
  </div>

  <div id="main_container">
  <div>
    <label>Kατηγορίες</label>
  </div>
    <div>
      <label for="categories"></label>
      <select id="categories"></select>
    </div>
    <div id="autocomlete">
      <input type="text" id="search" placeholder="Items search..." autocomplete="off">
      <ul id="results"></ul>
    </div>
    <div id="tables">
      <h2>Αποθήκη</h2>
      <div id=table_req>

        <table id="table_admin_request">
        <div>
          <thead>
            
              <tr>
                <th>ID</th>
                <th>'Ονομα Προϊόντος</th>
                <th>Κατηγορία</th>
                <th>Λεπτομέρειες</th>
                <th>Ποσότητα</th>

              </tr>
        
          </thead>
          </div>
          <tbody id="itemsTable"></tbody>
        </table>
      </div>
    </div>
    <div id="items_selected">
      <h3>Επιλεγμένα Προϊόντα </h3>
      <table id="tableSelected">
        <thead>
          <tr>
            <th>ID</th>
            <th>Όνομα Προϊόντος</th>
            <th>Άτομα</th>
            <th>Ακύρωση</th>
          </tr>
        </thead>
        <tbody id="itemSelected"></tbody>
      </table>
    </div>
    <div>
      <button id="submitRequest">Καταχώρηση</button>
    </div>

    <div id="request_t">
      <h4>Αιτήματα</h4>
      <table id="table_request">
        <thead>
          <tr>
            <th>Αντικείμενα</th>
            <th>Άτομα</th>
            <th>Ημερομηνία Καταχώρησης</th>
            <th>Ημερομηνία Παραλαβής</th>
            <th>Ημερομηνία Ολοκλήρωσης</th>
            <th>Ακύρωση</th>
          </tr>
        </thead>
        <tbody id="requests"></tbody>
      </table>
    </div>
  </div>
  </div>

  <script src="/scripts/citizen_requests.js"></script>
</body>

</html>