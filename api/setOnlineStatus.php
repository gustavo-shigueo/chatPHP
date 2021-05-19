<?php

  include_once './connection.php';
  $query = "UPDATE users SET online_status = ? WHERE id = ?";

  $stmt = $con -> prepare($query);
  $stmt -> bind_param('ii', $_POST['status'], $_POST['id']);
  $r = $stmt -> execute();