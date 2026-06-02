💚 INTEGRANTES
* Aline Aparecida da Silva Souza
* Cecília Georgeto
* Graciele Garglioni
* Hebert Santos Soares
* Isabelle Nastri Sales
* Isadora da Silva Zanardo
* Rafael Pecorari de Barros
* Rayan Luca Teixeira de Souza

# Como rodar o projeto

## O que precisa ter instalado

- VS Code
- Java JDK 17 ou superior
- Docker Desktop
- Node.js
- Expo Go, se for rodar no celular

---

## Rodar o backend

1. Abra o Docker Desktop.

2. Abra o projeto no VS Code.

3. Abra o terminal e entre na pasta do backend:

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

## Rodar o frontend

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
