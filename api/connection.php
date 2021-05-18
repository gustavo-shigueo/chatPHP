<?php
  session_start();

  $host = 'https://3006-apricot-leopard-ymp6bvu4.ws-us04.gitpod.io/';
  $user = 'root';
  $password = '';
  $database = 'chat';

  $con = mysqli_connect($host, $user, $password, $database);
  if ($con -> connect_error) echo "Fail " . $con -> connect_error;

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");
  header("Access-Control-Expose-Headers: *");
  header("Access-Control-Allow-Methods: *");''