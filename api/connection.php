<?php
  $host = 'localhost';
  $user = 'root';
  $password = '';
  $database = 'chat';

  $con = mysqli_connect($host, $user, $password, $database);
  if ($con -> connect_error) echo "Fail " . $con -> connect_error;

  header("Access-Control-Allow-Origin: https://5500-purple-sailfish-i4x322q5.ws-us04.gitpod.io");
  header("Access-Control-Allow-Headers: *");
  header("Access-Control-Expose-Headers: *");
  header("Access-Control-Allow-Methods: *");
  header("Access-Control-Allow-Credentials: true");