<?php

  namespace MyApp;

  use Ratchet\ConnectionInterface;
  use Ratchet\MessageComponentInterface;

  final class Chat implements MessageComponentInterface {
    private $clients;

    public function __construct() {
      $this -> clients = new \SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn): void {
      $this -> clients -> attach($conn);
      echo "New connection! ({$conn -> resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void {
      $numRecv = count($this -> clients) - 1;
      echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n", $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

      $msg = json_decode($msg);
      if ($msg -> action === 'login' || $msg -> action === 'logout') {
        foreach ($this -> clients as $client) {
          if ($from !== $client) $client -> send(json_encode($msg));
          else if ($msg -> action === 'login') $client -> id = $msg -> id;
        }

        if ($msg -> action === 'logout') {
          $fields = [
            'id' => $msg -> id,
            'status' => 0
          ];
          $fields_string = http_build_query($fields);

          $ch = curl_init();

          curl_setopt($ch,CURLOPT_URL, $msg -> url);
          curl_setopt($ch,CURLOPT_POST, true);
          curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

          curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

          $result = curl_exec($ch);
        }
      }

      if ($msg -> action === 'register') {
        foreach ($this -> clients as $client) {
          if ($from !== $client) print_r($msg);
          if ($from !== $client) $client -> send(json_encode($msg));
        }
      }
    }

    public function onClose(ConnectionInterface $conn): void {
      $this -> clients -> detach($conn);
      echo "Connection {$conn -> resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void {
      echo "An error has occurred: {$e -> getMessage()}\n";
      $conn -> close();
    }
  }