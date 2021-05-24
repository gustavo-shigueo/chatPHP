<?php
  include_once './connection.php';

  foreach ($_POST as $key => $value) $$key = $value;
  if(
    !isset($id) || empty($id) ||
    !isset($receiver_id) || empty($receiver_id)
  ) {
    $response = array('error' => 'Please verify that you arr logged in and provide the receiver\'s id');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  $query = "SELECT * FROM `messages` WHERE (`sender_id` = ? AND `receiver_id` = ?) OR (`sender_id` = ? AND `receiver_id` = ?) ORDER BY `timeSent`, `id` DESC";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param("iiii", $id, $receiver_id, $receiver_id, $id);
  $stmt -> execute();
  $result = $stmt -> get_result();
  
  while ($message = $result -> fetch_assoc()) $messages[] = $message;
  
  $query = "SELECT `name`, `online_status` FROM `users` WHERE `id` = ?";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param("i", $receiver_id);
  $stmt -> execute();
  $result = $stmt -> get_result();
  $receiver = $result -> fetch_assoc();

  $response = [
    'receiver' => $receiver,
    'messages' => $messages ?? []
  ];
  echo(json_encode($response));