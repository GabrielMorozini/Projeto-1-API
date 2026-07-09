<?php

require_once __DIR__ . '/controllers.php';

$dataFile = __DIR__ . '/../../data/data.json';

$method = $_SERVER['REQUEST_METHOD'];

match ($method) {
    'GET' => handleGet($dataFile),
    'POST' => handlePost($dataFile),
    'PUT' => handlePut($dataFile),
    'PATCH' => handlePatch($dataFile),
    'DELETE' => handleDelete($dataFile),
    default => handleMethodNotAllowed(),
};