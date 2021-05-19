<?php
  
  require 'vendor/autoload.php';
 
  $dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__);
  $dotenv -> load();

  $url = getenv("GITPOD_WORKSPACE_URL");
  $hostname = explode('/', $url)[2];
  $origin = "https://8081-$hostname";

  $host = 'localhost';
  $user = 'root';
  $password = '';
  $database = 'chat';

  $con = mysqli_connect($host, $user, $password, $database);
  if ($con -> connect_error) echo "Fail " . $con -> connect_error;

  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Headers: *");
  header("Access-Control-Expose-Headers: *");
  header("Access-Control-Allow-Methods: *");
  header("Access-Control-Allow-Credentials: true");