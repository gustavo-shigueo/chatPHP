<?php
  include_once './connection.php';

  $users = array();
  // POSSIBLE NEW QUERY:
  // SELECT 
  //   id AS user_id,
  //   name,
  //  (SELECT
  //    text
  //   FROM messages
  //   WHERE
  //     sender_id = 1 AND receiver_id = u
  //     OR 
  //     eceiver_id = 1 AND sender_id = u
  //   ORDER BY timeSent DESC
  //   LIMIT 1) AS lastMsg
  //   FROM users
  //   WHERE id != 1;
  $query = "SELECT `id`, `name`, `online_status` FROM users WHERE `id` != ?  ORDER BY `online_status`, `name` DESC";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('i', $_POST['id']);
  $stmt -> execute();
  $result = $stmt -> get_result();

  while ($user = $result -> fetch_assoc()) $users[] = $user;
  echo(json_encode($users));