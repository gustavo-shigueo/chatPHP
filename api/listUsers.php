<?php
  include_once './connection.php';

  $users = array();
  // POSSIBLE NEW QUERY:
  // SELECT 
  //   id AS user_id,
  //   name,
  //   (SELECT
  //      text
  //      FROM messages
  //      WHERE
  //        sender_id = ? AND receiver_id = u
  //        OR 
  //        receiver_id = ? AND sender_id = u
  //      ORDER BY timeSent DESC
  //      LIMIT 1
  //   ) AS lastMsg
  // FROM users
  // WHERE id != ?;
  $subquery = "SELECT `text` FROM messages WHERE sender_id = ? AND receiver_id = `user_id` OR sender_id = `user_id` AND receiver_id = ? ORDER BY timeSent DESC LIMIT 1";
  $query = "SELECT `id` AS `user_id`, `name`, `online_status`, ($subquery) AS lastMsg FROM users WHERE `id` != ?  ORDER BY `online_status`, `name` DESC";
  $stmt = $con -> prepare($query);
  $stmt -> bind_param('iii', $_POST['id'], $_POST['id'], $_POST['id']);
  $stmt -> execute();
  $result = $stmt -> get_result();

  while ($user = $result -> fetch_assoc()) $users[] = $user;
  echo(json_encode($users));