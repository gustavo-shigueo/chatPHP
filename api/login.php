<?php
  include_once ('./connection.php');

  foreach ($_POST as $key => $value) $$key = $value;

  if (
    !isset($email) || empty($email) ||
    !isset($password) || empty($password)
  ) {
    $response = array('error' => 'All fields are required');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  $query = "SELECT * FROM users WHERE email = ?";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('s', $email);
  $stmt -> execute();
  $result = $stmt -> get_result();

  if ($result -> num_rows === 1) {
    $user = $result -> fetch_assoc();

    if (password_verify($password, $user['password'])) {
      $response = array('success' => true);
      $_SESSION['id'] = $user['id'];
      echo json_encode($response);
      http_response_code(200);
      exit;
    } else {
      $response = array('error' => 'Invalid credentials');
      echo json_encode($response);
      http_response_code(401);
      exit;
    }
  } else {
    $response = array('error' => 'Invalid credentials');
    echo json_encode($response);
    http_response_code(401);
    exit;
  }