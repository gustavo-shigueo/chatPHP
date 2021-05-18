<?php
  session_start();

  $host = 'localhost';
  $user = 'root';
  $password = '';
  $database = 'chat';

  $con = mysqli_connect($host, $user, $password, $database);
  if ($con -> connect_error) echo "Fail " . $con -> connect_error;

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");
  header("Access-Control-Expose-Headers: *");
  header("Access-Control-Allow-Methods: *");