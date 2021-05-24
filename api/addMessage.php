<?php
  include_once './connection.php';

  foreach ($_POST as $key => $value) $$key = $value;
  if(
    !isset($id) || empty($id) ||
    !isset($receiver_id) || empty($receiver_id) ||
    !isset($text) || empty($text)
  ) {
    $response = array('error' => 'Please verify that you arr logged in and provide the receiver\'s id');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  $query = "INSERT INTO `messages` VALUES (NULL, ?, ?, ?, UTC_TIMESTAMP())";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param("iis", $id, $receiver_id, $text);
  $stmt -> execute();