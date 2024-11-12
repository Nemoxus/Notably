<?php
$host = 'your-own-host-name';
$db = 'db-name';
$user = 'user-name';
$password = 'your-password';
$port = "your-port";

$conn = new mysqli($host, $user, $password, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected successfully!";
}

$conn->close();
?>
