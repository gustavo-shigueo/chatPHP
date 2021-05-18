<?php
  include_once './connection.php';

  $users = array();
  $query = "SELECT `id`, `name`, `online_status` FROM users WHERE `id` != ?  ORDER BY `online_status`, `name` DESC";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('i', $_POST['id']);
  $stmt -> execute();
  $result = $stmt -> get_result();

  while ($user = $result -> fetch_assoc()) $users[] = $user;
  echo(json_encode($users));