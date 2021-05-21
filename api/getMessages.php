<?php
  include_once './connection.php';

  foreach ($_POST as $key => $value) $$key = $value;
  if(
    !isset($name) || empty($name) ||
    !isset($id) || empty($receiver_id)
  ) {
    $response = array('error' => 'Please provide the receiver\'s id');
    echo json_encode($response);
    http_response_code(400);
    exit;
  }

  $query = "SELECT FROM * messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY time_sent, ID DESC";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param("iiii", $id, $receiver_id, $receiver_id, $id);
  $stmt -> execute();
  $result = $stmt -> get_result();

  while ($message = $result -> fetch_assoc()) $messages[] = $message;
  echo(json_encode($messages));