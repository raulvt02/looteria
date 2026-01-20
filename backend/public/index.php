<?php
require_once "../config/database.php";

$db = new Database();
$conn = $db->connect();

if ($conn) {
    echo "Conectado correctamente a la base de datos Looteria";
} else {
    echo "Error al conectar";
}


