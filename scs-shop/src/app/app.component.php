<?php session_start();?>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCS</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDgEhxoik76va_nhG6KsA4DTa5JBr_Iz0I&callback=initMap"></script>
</head>

<body>
  <?php
    if (isset($_SESSION['email'])) {
      include 'navbar2.php';
    } else {
      include 'navbar.html';
    }
    include 'storeSelector.html';
  ?>

  <div class="container-fluid">
    <div class="row justify-content-center text-center border p-5">
        <h1>Welcome to SCS</h1>
        <a href="items.php" class="btn btn-outline-primary w-auto">Shop All</a>
    </div>
    <div class="row justify-content-center text-center">
        <div class="col border p-5">
        <h2>Tops</h2>
        <a href="#" class="btn btn-outline-primary w-auto">Shop Now</a>
        </div>
        <div class="col border p-5">
        <h2>Bottoms</h2>
        <a href="#" class="btn btn-outline-primary w-auto">Shop Now</a>
        </div>
    </div>
  </div>
</body>


<router-outlet></router-outlet>
