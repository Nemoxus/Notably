<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// If it's an OPTIONS request, stop here (pre-flight CORS check)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$host = 'your-own-host-name';
$db = 'db-name';
$user = 'user-name';
$password = 'your-password';
$port = "your-port";

try {
    $conn = new mysqli($host, $user, $password, $db, $port);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $response = ["success" => false, "message" => ""];
    $postData = $_POST;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        error_log("Received POST data: " . print_r($postData, true));

        if (isset($postData['action'])) {
            switch ($postData['action']) {
                case 'login':
                    if (!isset($postData['email']) || !isset($postData['password'])) {
                        throw new Exception("Missing required login fields");
                    }

                    $stmt = $conn->prepare("SELECT * FROM users WHERE emailid = ?");
                    if (!$stmt) {
                        throw new Exception("Failed to prepare statement: " . $conn->error);
                    }

                    $stmt->bind_param("s", $postData['email']);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result->num_rows === 0) {
                        throw new Exception("User not found");
                    }

                    $user = $result->fetch_assoc();
                    if (password_verify($postData['password'], $user['password'])) {
                        $response = [
                            "success" => true,
                            "message" => "Login successful",
                            "user" => [
                                "email" => $user['emailid'],
                                "name" => $user['name']
                            ]
                        ];
                    } else {
                        throw new Exception("Invalid password");
                    }
                    $stmt->close();
                    break;

                case 'signup':
                    if (!isset($postData['email']) || !isset($postData['password']) || !isset($postData['name'])) {
                        throw new Exception("Missing required signup fields: email, password, or name");
                    }

                    $email = $postData['email'];
                    $password = password_hash($postData['password'], PASSWORD_DEFAULT);
                    $name = $postData['name'];

                    $stmt = $conn->prepare("INSERT INTO users (emailid, password, name) VALUES (?, ?, ?)");
                    if (!$stmt) {
                        throw new Exception("Failed to prepare statement: " . $conn->error);
                    }

                    $stmt->bind_param("sss", $email, $password, $name);

                    if ($stmt->execute()) {
                        $response = [
                            "success" => true,
                            "message" => "Signup successful"
                        ];
                    } else {
                        throw new Exception("Failed to create user: " . $stmt->error);
                    }
                    $stmt->close();
                    break;

                case 'addTask':
                    if (!isset($postData['emailid']) || !isset($postData['content'])) {
                        throw new Exception("Missing required task fields: emailid or content");
                    }

                    $emailid = $postData['emailid'];
                    $taskName = $postData['content'];
                    $category = isset($postData['category']) ? $postData['category'] : '';
                    $date = isset($postData['date']) ? $postData['date'] : '';
                    $notes = isset($postData['notes']) ? $postData['notes'] : '';

                    $stmt = $conn->prepare("INSERT INTO tasks (emailid, task_name, category, date, notes) VALUES (?, ?, ?, ?, ?)");
                    if (!$stmt) {
                        throw new Exception("Failed to prepare statement: " . $conn->error);
                    }

                    $stmt->bind_param(
                        "sssss",
                        $emailid,
                        $taskName,
                        $category,
                        $date,
                        $notes
                    );

                    if ($stmt->execute()) {
                        $response = [
                            "success" => true,
                            "task_id" => $conn->insert_id
                        ];
                    } else {
                        throw new Exception("Failed to add task: " . $stmt->error);
                    }
                    $stmt->close();
                    break;

                case 'getTasks':
                    $emailid = $postData['emailid'];
                    $stmt = $conn->prepare("SELECT * FROM tasks WHERE emailid = ?");
                    if (!$stmt) {
                        throw new Exception("Failed to prepare statement: " . $conn->error);
                    }

                    $stmt->bind_param("s", $emailid);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $tasks = $result->fetch_all(MYSQLI_ASSOC);
                    $response = $tasks;
                    $stmt->close();
                    break;

                case 'deleteTask':
                    if (!isset($postData['task_id'])) {
                        throw new Exception("Missing task ID");
                    }

                    $stmt = $conn->prepare("DELETE FROM tasks WHERE task_id = ?");
                    if (!$stmt) {
                        throw new Exception("Failed to prepare statement: " . $conn->error);
                    }

                    $stmt->bind_param("i", $postData['task_id']);
                    if ($stmt->execute()) {
                        $response = ["success" => true];
                    } else {
                        throw new Exception("Failed to delete task: " . $stmt->error);
                    }
                    $stmt->close();
                    break;

                default:
                    throw new Exception("Invalid action: " . $postData['action']);
            }
        } else {
            throw new Exception("Missing required field: action");
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['emailid'])) {
            $emailid = $_GET['emailid'];
            $stmt = $conn->prepare("SELECT * FROM tasks WHERE emailid = ?");
            if (!$stmt) {
                $response = [
                    "success" => false,
                    "message" => "Failed to prepare statement: " . $conn->error
                ];
                echo json_encode($response);
                exit();
            }

            $stmt->bind_param("s", $emailid);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $tasks = $result->fetch_all(MYSQLI_ASSOC);
                $response = $tasks;
            } else {
                $response = [];
            }

            $stmt->close();
        } else {
            $response = [
                "success" => false,
                "message" => "Email ID is missing."
            ];
        }
    } else {
        throw new Exception("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    }
} catch (Exception $e) {
    $response = [
        "success" => false,
        "message" => $e->getMessage()
    ];
    error_log("Error: " . $e->getMessage());
} finally {
    if (isset($conn)) {
        $conn->close();
    }
    echo json_encode($response);
}
?>