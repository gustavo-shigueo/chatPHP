CREATE DATABASE IF NOT EXISTS chat DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE chat;

CREATE TABLE IF NOT EXISTS message (
  id int(11) NOT NULL AUTO_INCREMENT,
  sender_id int(11) NOT NULL,
  receiver_id int(11) NOT NULL,
  text text COLLATE utf8mb4_general_ci NOT NULL,
  timeSent datetime NOT NULL,
  PRIMARY KEY (id),
  KEY receiver_id (receiver_id),
  KEY sender_id (sender_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  email varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  password varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  online_status tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE message
  ADD CONSTRAINT message_ibfk_1 FOREIGN KEY (receiver_id) REFERENCES `users` (id),
  ADD CONSTRAINT message_ibfk_2 FOREIGN KEY (sender_id) REFERENCES `users` (id);