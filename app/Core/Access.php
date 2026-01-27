<?php

session_start();

// Páginas permitidas
$allowed_pages = ['index.php', 'login.php', 'testconexion.php'];

$current_page = basename($_SERVER['PHP_SELF']);


if (!in_array($current_page, $allowed_pages)) {
    header("Location: index.php");
    exit();
}
