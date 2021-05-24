<?php
  include_once './connection.php';

  foreach ($_POST as $key => $value) $$key = $value;

  if (
    !isset($name) || empty($name) ||
    !isset($email) || empty($email) ||
    !isset($password) || empty($password) ||
    !isset($confirm_password) || empty($confirm_password) ||
    !isset($_FILES['file']) || empty($_FILES['file'])
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

  $ext = strtolower(explode('.', $_FILES['file']['name'])[1]);
  $newFileName = md5($_FILES['file']['name'] . time()) . '.' . $ext;
  $directory = "./images/";
  $imagePath = 'images/' . $newFileName;

  $hasedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

  $query = "INSERT INTO users VALUES (NULL, ?, ?, ?, 0, ?)";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('ssss', $name, $email, $hasedPassword, $imagePath);
  $result = $stmt -> execute();

  if ($result) {
    move_uploaded_file($_FILES['file']['tmp_name'], $directory . $newFileName);
    $response = array('success' => true, 'id' => $con -> query("SELECT LAST_INSERT_ID()") -> fetch_assoc()['LAST_INSERT_ID()']);
    echo json_encode($response);
    http_response_code(201);
    exit;
  } else {
    $response = array('error' => 'E-mail already in use');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }
