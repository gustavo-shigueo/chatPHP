<?php

  include_once ('./connection.php');
  if (isset($_SESSION['id']) && $_SESSION['id'] > 0) {
    http_response_code(200);
    $response = array('id' => $_SESSION['id']);
    echo json_encode($response);
    exit;
  } else {
    http_response_code(401);
    $response = array('error' => 'Not logged in');
    echo json_encode($response);
    exit;
  }