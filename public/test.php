<?php
require_once '../app/Core/Database.php';

$conn = Database::getInstance();

if (!$conn) {
    die("Error al conectar a la base de datos");
}

$stmt = $conn->query("SELECT COUNT(*) AS total_usuarios FROM usuario");
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo "Conectado correctamente a la base de datos Looteria<br>";
echo "Total de usuarios en la base de datos: " . $result['total_usuarios'];
