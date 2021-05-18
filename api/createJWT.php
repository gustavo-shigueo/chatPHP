<?php

  require 'vendor/autoload.php';
 
  $dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__);
  $dotenv -> load();

  function createJWT($id): string {
    $exp = time() + 60 * 60 * 24 * 7;
  
    $header = [
      'alg' => 'HS256',
      'typ' => 'JWT'
    ];
    $header = json_encode($header);
    $header = base64_encode($header);

    $payload = [
      'exp' => $exp,
      'id' => $id,
    ];
    $payload = json_encode($payload);
    $payload = base64_encode($payload);

    $signature = hash_hmac('sha256', "$header.$payload", getenv("ACCESS_TOKEN_KEY"), true);
    $signature = base64_encode($signature);

    return "$header.$payload.$signature";
  };