# Backend DoUAUlingo

Backend inicial em Java + Spring Boot + PostgreSQL para login e cadastro.

## Tecnologias

- Java 17
- Spring Boot 3
- PostgreSQL
- Spring Data JPA
- Spring Security
- JWT
- Docker Compose

## Como rodar

### 1. Subir o PostgreSQL

```bash
docker compose up -d
```

### 2. Rodar o backend

```bash
./mvnw spring-boot:run
```

No Windows, caso tenha Maven instalado:

```bash
mvn spring-boot:run
```

O backend roda em:

```txt
http://localhost:8080
```

## Endpoints

### Cadastro

```http
POST /auth/register
```

Body:

```json
{
  "nome": "Rafael",
  "email": "rafael@email.com",
  "senha": "123456"
}
```

### Login

```http
POST /auth/login
```

Body:

```json
{
  "email": "rafael@email.com",
  "senha": "123456"
}
```

### Buscar usuário logado

```http
GET /auth/me
Authorization: Bearer SEU_TOKEN
```
