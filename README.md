💚 INTEGRANTES
* Aline Aparecida da Silva Souza
* Cecília Georgeto
* Graciele Garglioni
* Hebert Santos Soares
* Isabelle Nastri Sales
* Isadora da Silva Zanardo
* Rafael Pecorari de Barros
* Rayan Luca Teixeira de Souza

# doUAUlingo - Projeto Local

Aplicativo de aprendizado gamificado desenvolvido com **Expo / React Native** no frontend e **Java Spring Boot** no backend.

---

## O que precisa ter instalado

- VS Code
- Java JDK 17 ou superior
- Docker Desktop
- Node.js
- Expo Go, se for rodar no celular

---

## Como rodar o backend

1. Abra o **Docker Desktop**.

2. Abra o projeto no **VS Code**.

3. No terminal, entre na pasta do backend:

```powershell
cd Backend
```

4. Suba o banco de dados:

```powershell
docker compose up -d
```

5. Se for a primeira vez rodando, crie o banco:

```powershell
docker exec -it douaulingo_postgres psql -U postgres
```

6. Dentro do PostgreSQL, rode:

```sql
CREATE DATABASE douauling;
```

7. Depois saia:

```sql
\q
```

8. No VS Code, abra o arquivo:

```txt
Backend/src/main/java/com/douauling/backend/BackendApplication.java
```

9. Clique no botão **Play** para iniciar o backend.

O backend vai rodar em:

```txt
http://localhost:8080
```

---

## Como rodar o frontend

1. Abra outro terminal.

2. Entre na pasta do frontend:

```powershell
cd Frontend/DoUAUlingo
```

3. Instale as dependências:

```powershell
npm install
```

4. Rode o projeto:

```powershell
npx expo start --web
```

Para rodar no celular:

```powershell
npx expo start
```

Depois escaneie o QR Code com o aplicativo **Expo Go**.

---

## Ordem para rodar sempre

1. Abrir Docker Desktop
2. Rodar `docker compose up -d` na pasta `Backend`
3. Abrir `BackendApplication.java` e clicar no **Play**
4. Entrar na pasta `Frontend/DoUAUlingo`
5. Rodar `npx expo start --web`

---

## Como o frontend se conecta com o backend

O frontend do projeto foi desenvolvido em **Expo / React Native** e se comunica com o backend em **Java Spring Boot** por meio de requisições HTTP usando `fetch()`.

A URL base da API está configurada no frontend como:

```tsx
const API_URL = "http://localhost:8080";
```

Isso significa que o app está chamando o backend que está rodando localmente na porta `8080`.

---

## Fluxo geral da aplicação

```txt
Frontend Expo / React Native
        ↓ fetch()
Backend Spring Boot - localhost:8080
        ↓ JPA / Hibernate
PostgreSQL - Docker
```

---

## Principais endpoints usados pelo frontend

### Login

O frontend envia e-mail e senha para o backend:

```tsx
fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, senha }),
});
```

Esse endpoint valida o usuário e retorna os dados para manter o login no aplicativo.

---

### Cadastro

O frontend envia os dados do novo usuário:

```tsx
fetch(`${API_URL}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nome,
    email,
    senha,
  }),
});
```

Esse endpoint cria um novo usuário no banco de dados.

---

### Buscar dados do usuário

Após o login, o frontend busca os dados atualizados do usuário:

```tsx
fetch(`${API_URL}/usuarios/me?email=${usuario.email}`);
```

Esse endpoint retorna informações como:

```txt
nome
email
xp
nivel
streak
avatar
```

---

### Salvar progresso dos desafios

Quando o usuário conclui um desafio, o frontend chama:

```tsx
fetch(
  `${API_URL}/progresso/concluir?email=${usuario.email}&desafioId=${challenge.id}`,
  {
    method: "POST",
  }
);
```

Esse endpoint salva o progresso do usuário e atualiza dados como XP, nível e sequência de dias.

---

### Buscar progresso

O Dashboard e a tela de Conquistas usam:

```tsx
fetch(`${API_URL}/progresso?email=${usuario.email}`);
```

Com isso, o frontend sabe quais desafios já foram concluídos.

---

## Estrutura
O projeto está dividido em duas partes: Backend e Frontend.

O Backend é a parte da API, feita em Java/Spring Boot. Ele fica responsável pelas regras do sistema, banco de dados, autenticação e envio de informações para o aplicativo. Arquivos como pom.xml, Dockerfile e docker-compose.yml servem para configurar dependências e executar o backend.

O Frontend é o aplicativo mobile feito em Expo/React Native. A pasta principal é DoUAUlingo, onde ficam as telas, imagens, componentes e configurações do app.

Dentro do Expo, a pasta mais importante é a app, porque ela organiza as telas e rotas. Arquivos como index.js, login.js, register.js e forgot-password.js representam telas do aplicativo. A pasta (tabs) guarda as telas com navegação por abas.

As pastas components, contexts e assets ajudam na organização: components guarda partes reutilizáveis da interface, contexts guarda dados globais do app, e assets guarda imagens e ícones.

## Resumo

O frontend não acessa o banco de dados diretamente. Ele envia requisições para o backend Spring Boot, e o backend é responsável por validar, processar e salvar as informações no PostgreSQL.

O README apresenta o projeto doUAUlingo, um aplicativo gamificado de aprendizado desenvolvido com Expo/React Native no frontend e Java Spring Boot no backend.

Ele explica os integrantes do grupo, os programas necessários para rodar o projeto, como VS Code, Java JDK 17, Docker, Node.js e Expo Go, além do passo a passo para iniciar o backend, o banco PostgreSQL via Docker e o frontend pelo Expo.

Também mostra que o frontend se conecta ao backend por meio de requisições HTTP usando fetch(), acessando a API em http://localhost:8080. O app utiliza endpoints para login, cadastro, busca de dados do usuário, progresso dos desafios e atualização de XP, nível e sequência.

Resumindo, o README serve como um guia para instalar, executar e entender a comunicação entre o app Expo, o backend Spring Boot e o banco PostgreSQL.
