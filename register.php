<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");


$servername = "localhost";
$username = "root";      
$password = "";          
$dbname = "kursy";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Błąd połączenia z bazą danych: " . $conn->connect_error]);
    exit;
}


$input = json_decode(file_get_contents("php://input"), true);

$nickname = trim($input['nickname'] ?? "");
$email = trim($input['email'] ?? "");
$password = trim($input['password'] ?? "");


if (!$nickname || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Wszystkie pola są wymagane"]);
    exit;
}





$stmt = $conn->prepare("INSERT INTO users (NICKNAME, PASSWORD, EMAIL,ROLE_ID) VALUES (?, ?, ?, 1)");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Błąd przygotowania zapytania: " . $conn->error]);
    exit;
}

$stmt->bind_param("sss", $nickname, $password, $email);


if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "message" => "Rejestracja udana"]);
} else {
    
    echo json_encode(["status" => "error", "message" => "Błąd przy rejestracji: " . $stmt->error]);
}


$stmt->close();
$conn->close();
?>
