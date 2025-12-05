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

$email = trim($input['email'] ?? "");
$pass = trim($input['password'] ?? "");

if (!$email || !$pass) {
    echo json_encode(["status" => "error", "message" => "Wszystkie pola są wymagane"]);
    exit;
}


$stmt = $conn->prepare("SELECT ID, PASSWORD FROM users WHERE EMAIL = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Błąd przygotowania zapytania: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();


if ($stmt->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Użytkownik o podanym e-mailu nie istnieje"]);
    exit;
}


$stmt->bind_result($user_id, $hased);
$stmt->fetch();


if (password_verify($pass,$hased)) {
    echo json_encode(["status" => "ok", "message" => "Zalogowano pomyślnie", "user_id" => $user_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Błędne hasło"]);
}

$stmt->close();
$conn->close();
?>
