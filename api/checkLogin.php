<?php
  include_once './connection.php';
  include_once './setTokenCookie.php';
  include_once './createJWT.php';

  require 'vendor/autoload.php';

  $dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__);
  $dotenv -> load();

  $token = $_COOKIE['at'];

  $token_section_arr = explode(".",$token);

  $header = $token_section_arr[0];
  $payload = $token_section_arr[1];
  $signature = $token_section_arr[2];

  $valid = hash_hmac('sha256', "$header.$payload", getenv('ACCESS_TOKEN_KEY'), true);
  $valid = base64_encode($valid);
  $response = null;

  if ($signature === $valid) {
    $payload = json_decode(base64_decode($payload));

    if (time() >= $payload -> exp) {
      http_response_code(401);
      $response = array('error' => 'Expired token');
    } else {
      $query = "SELECT `id`, `name` FROM users WHERE id = ?";
      $stmt = $con -> prepare($query);
      $stmt -> bind_param('i', $payload -> id);
      $stmt -> execute();
      $result = $stmt -> get_result();

      if ($result -> num_rows === 1) {
        $user = $result -> fetch_assoc();
        $response = $user;
        $accessToken = createJWT($user['id']);
        setTokenCookie($accessToken);
      } else {
        $response = array('error' => 'Invalid token');
      }

    }
    echo json_encode($response);
    exit;
  } else {
    http_response_code(401);
    $response = array('error' => 'Invalid token');
    echo json_encode($response);
    exit;
  }