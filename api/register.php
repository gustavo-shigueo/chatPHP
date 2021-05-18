<?php
  include_once ('./connection.php');

  foreach ($_POST as $key => $value) $$key = $value;

  if (
    !isset($name) || empty($name) ||
    !isset($email) || empty($email) ||
    !isset($password) || empty($password) ||
    !isset($confirm_password) || empty($confirm_password)
  ) {
    $response = array('error' => 'All fields are required');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  if ($password !== $confirm_password) {
    $response = array('error' => 'Passwords must match');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  $hasedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

  $query = "INSERT INTO users VALUES (NULL, ?, ?, ?, 0)";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('sss', $name, $email, $hasedPassword);
  $result = $stmt -> execute();

  if ($result) {
    $response = array('success' => true);
    echo json_encode($response);
    http_response_code(201);
    exit;
  } else {
    $response = array('error' => 'E-mail already in use');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }
