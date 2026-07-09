<?php

function serveView(string $path): void
{
    if (!file_exists($path)) {
        http_response_code(404);
        echo json_encode(['error' => 'View not found']);
        return;
    }

    header('Content-Type: text/html; charset=utf-8');
    readfile($path);
}

function serveJson(string $path): void
{
    if (!file_exists($path)) {
        http_response_code(404);
        echo json_encode(['error' => 'JSON file not found']);
        return;
    }

    header('Content-Type: application/json; charset=utf-8');
    readfile($path);
}