<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ccs_profiling");
    echo "Database created successfully\n";
} catch (PDOException $e) {
    if ($e->getCode() == 1045) {
        echo "Authentication failed. Is there a password for root?\n";
    } elseif ($e->getCode() == 2002) {
        echo "Connection refused. Is MySQL running on port 3306?\n";
    } else {
        echo "Connection failed: " . $e->getMessage() . "\n";
    }
    exit(1);
}
