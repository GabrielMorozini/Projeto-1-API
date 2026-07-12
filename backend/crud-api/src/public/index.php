<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/openapi.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

//CORS
in_array($origin, $allowedOrigins) ?
    header("Access-Control-Allow-Origin: $origin") : null; // O origin acessa a API se estiver em $allowedOrigins
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS'); // Acesso as funções da API
header('Access-Control-Allow-Headers: Content-Type'); // quais headers podem ser enviados na requisição

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Envia uma resposta de sucesso sem conteúdo
    exit;
}

$uri = strtok($_SERVER['REQUEST_URI'], '?'); //Remove query string da URI 

match ($uri) {
    '/api/users' => require __DIR__ . '/../src/api.php',
    '/docs' => serveView(__DIR__ . '/../views/docs.html'),
    '/openapi.json' => serveJson(__DIR__ . '/../openapi.json'),
    default => notFound(),
};

function notFound(): void
{
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}