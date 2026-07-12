# Projeto 1 API — CRUD de Usuários

API REST simples em PHP puro (sem framework) para gerenciamento de usuários, com armazenamento em arquivo JSON e frontend em HTML/CSS/JS vanilla. Projeto desenvolvido como parte da disciplina de Análise e Desenvolvimento de Sistemas (ADS).

## Índice

- [Projeto 1 API — CRUD de Usuários](#projeto-1-api--crud-de-usuários)
  - [Índice](#índice)
  - [Visão geral](#visão-geral)
  - [Arquitetura](#arquitetura)
  - [Estrutura de pastas](#estrutura-de-pastas)
  - [Fluxo de uma requisição](#fluxo-de-uma-requisição)
  - [Endpoints](#endpoints)
  - [Como rodar](#como-rodar)
  - [Documentação da API](#documentação-da-api)

## Visão geral

O backend expõe uma API REST para operações CRUD (Create, Read, Update, Delete) sobre usuários, persistindo os dados em um arquivo `data.json` (sem banco de dados relacional). O frontend consome essa API via `fetch`, renderizando os dados no DOM.

## Arquitetura

O backend segue uma separação em camadas, cada uma com uma responsabilidade específica:

```
Requisição HTTP
     │
     ▼
index.php        → roteamento por URI (decide qual recurso tratar)
     │
     ▼
api.php           → roteamento por método HTTP (GET, POST, PUT, PATCH, DELETE)
     │
     ▼
controllers.php   → recebe a requisição, trata erros (try/catch) e formata a resposta
     │
     ▼
services.php      → regra de negócio (validações, orquestração)
     │
     ▼
data.php          → acesso e persistência dos dados (leitura/escrita no data.json)
```

Cada camada só conhece a camada imediatamente abaixo, o que facilita manutenção e testes isolados.

## Estrutura de pastas

```
PROJETO 1 API/
├── backend/
│   └── crud-api/
│       ├── data/
│       │   └── data.json          # "banco de dados" em arquivo
│       ├── src/
│       │   ├── config/
│       │   │   └── config.php     # configurações (ex: origens permitidas para CORS)
│       │   ├── public/
│       │   │   ├── index.php      # front controller / roteamento por URI
│       │   │   └── openapi.php    # funções auxiliares para servir docs e JSON
│       │   ├── src/
│       │   │   ├── api.php            # roteamento por método HTTP
│       │   │   ├── controllers.php    # handlers de cada verbo HTTP
│       │   │   ├── data.php           # acesso a dados (data.json)
│       │   │   ├── services.php       # regras de negócio
│       │   │   └── validation.php     # validação de entrada
│       │   └── view/
│       │       ├── docs.html          # documentação estática (Swagger UI)
│       │       └── openapi.json       # especificação OpenAPI
│       ├── compose.yml
│       └── Dockerfile
└── frontend/
    ├── assets/
    │   └── icone.png
    ├── src/
    │   ├── script/
    │   │   ├── api/            # funções de comunicação com o backend (fetch)
    │   │   └── dom/             # funções de manipulação/renderização do DOM
    │   ├── style/
    │   │   ├── reset.css
    │   │   └── style.css
    │   └── app.js
    ├── index.html
    ├── compose.yml
    └── Dockerfile
```

## Fluxo de uma requisição

1. O cliente faz uma requisição HTTP (ex: `GET /api/users`)
2. `index.php` trata CORS (headers de origem, métodos e headers permitidos) e responde a requisições `OPTIONS` (preflight) com `204`
3. `index.php` identifica a URI (ignorando query string) e roteia:
   - `/api/users` → `api.php`
   - `/docs` → serve a documentação HTML
   - `/openapi.json` → serve a especificação OpenAPI
   - qualquer outra rota → `404 Not Found`
4. `api.php` identifica o método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e chama o handler correspondente em `controllers.php`
5. O handler (`controllers.php`) captura erros inesperados com `try/catch`, lê o corpo da requisição quando necessário (`php://input`), delega a regra de negócio para `services.php`, e formata a resposta em JSON via a função `respond()`

## Endpoints

| Método | Rota          | Descrição                          |
|--------|---------------|-------------------------------------|
| GET    | `/api/users`  | Lista todos os usuários             |
| POST   | `/api/users`  | Cria um novo usuário                |
| PUT    | `/api/users?id={id}` | Atualiza um usuário (completo)|
| PATCH  | `/api/users?id={id}` | Atualiza um usuário (parcial) |
| DELETE | `/api/users?id={id}` | Remove um usuário             |

> Métodos não suportados retornam `405 Method Not Allowed`. Rotas não mapeadas retornam `404 Not Found`. Erros inesperados retornam `500 Internal Server Error`.

## Como rodar

Pré-requisitos: Docker e Docker Compose instalados.

```bash
# Backend
cd backend/crud-api
docker compose up --build

# Frontend (em outro terminal)
cd frontend
docker compose up --build
```

- Backend disponível em: `http://localhost:8000`
- Frontend disponível em: `http://localhost:8080`

## Documentação da API

Com o backend rodando, a documentação interativa (Swagger) fica disponível em:

```
http://localhost:8000/docs
```

E a especificação OpenAPI em formato JSON:

```
http://localhost:8000/openapi.json
```

---

**Autor:** Gabriel Morozini

**Projeto 1:** Criação de um crud simples utilizando API e Json 