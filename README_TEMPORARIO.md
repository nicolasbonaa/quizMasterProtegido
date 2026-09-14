# QuizMaster API - Versão 2.0 (protegida)

API RESTful em Node.js + Express + Sequelize + MySQL, criada como ambiente de estudo para desenvolvimento seguro de aplicações web.

- autenticação JWT
- autorização por usuário e administrador
- CRUD básico de usuários

> Esta versão aplica as correções de segurança descritas neste documento.

## 1) Requisitos

- Node.js 18+
- MySQL 8+
- npm
- Banco com acesso local ou remoto

## 2) Configuração do ambiente

1. Clone o projeto e entre na pasta.
2. Instale as dependências:

```bash
npm install
```

3. Crie o banco de dados no MySQL:

```sql
CREATE DATABASE quizmaster_db;
```

4. Ajuste as variáveis de ambiente no arquivo `.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizmaster_db
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=trespratosdetrigoparatrestigrestristes
JWT_EXPIRES_IN=7d
```

5. Inicie a aplicação:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

## 3) Endpoints da versão 1.0

### Base

- GET /api/

### Usuários

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Autenticação

- POST /api/register
- POST /api/login
- POST /api/logout

### Perfil

- GET /api/profile/:username
- GET /api/profile/me
- PUT /api/profile/me

## 4) Exemplos de requisições com Postman

### 4.1 Listar usuários

```http
GET http://localhost:3000/api/users
```

### 4.2 Criar usuário

```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "username": "aluno1",
  "email": "aluno1@email.com",
  "password": "123456",
  "fullName": "Aluno Um",
  "bio": "Estudante de segurança"
}
```

### 4.3 Atualizar usuário

```http
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "username": "aluno_atualizado",
  "fullName": "Aluno Atualizado",
  "bio": "Novo perfil"
}
```

### 4.4 Excluir usuário

```http
DELETE http://localhost:3000/api/users/1
```

### 4.5 Registro

```http
POST http://localhost:3000/api/register
Content-Type: application/json

{
  "username": "demo",
  "email": "demo@email.com",
  "password": "123456",
  "confirmPassword": "123456",
  "fullName": "Usuário Demo"
}
```

### 4.6 Login

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "login": "demo",
  "password": "123456"
}
```

## 5) Controles de segurança (Versão 2.0)

### 5.1 SQL Injection

O login usa consultas parametrizadas pelo Sequelize e compara senhas com bcrypt. Payloads SQL são tratados como texto e não alteram a consulta.

### 5.2 XSS

Campos textuais são validados e escapados antes do armazenamento. A API retorna JSON e o frontend também deve aplicar escape contextual antes de renderizar dados.

### 5.3 CSRF

Antes de qualquer requisição `POST`, `PUT`, `PATCH` ou `DELETE`, obtenha um token:

```http
GET http://localhost:3000/api/csrf-token
```

Envie o cookie recebido e o mesmo valor no header `X-CSRF-Token`. Requisições sem os dois valores são rejeitadas com `403`.

### 5.4 Outros controles

- Senhas são armazenadas com bcrypt e nunca retornadas pela API.
- CRUD de usuários exige JWT; alterações de terceiros exigem administrador.
- Uploads aceitam somente JPEG, PNG e WebP, com limite de 2 MB e nomes gerados pelo servidor.
- Helmet, CORS restrito e rate limiting protegem a camada HTTP.
- Mensagens de erro internas não são expostas em produção.

## 6) Estrutura do projeto

```text
.
├── app.js
├── .env
├── package.json
├── README.md
├── bin/
│   └── www
├── config/
│   ├── constants.js
│   ├── database.js
│   └── jwt.js
├── middlewares/
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   ├── auth.js
│   ├── errorHandler.js
│   └── profileMulter.js
├── modules/
│   ├── search/
│   └── user/
├── public/
│   └── uploads/
├── routes/
│   └── index.js
└── examples/
    └── csrf-malicioso.html
```

## 7) Relatório Executivo

### Sumário Executivo

A versão 2.0 aplica controles de autenticação, autorização, validação, proteção CSRF, limitação de requisições e tratamento seguro de uploads.

A aplicação deve ser executada apenas com um `JWT_SECRET` forte definido no ambiente e com CORS configurado para as origens confiáveis.

### Relatório Técnico

- Consultas de usuário são feitas pelo Sequelize com parâmetros.
- Entradas textuais são validadas e escapadas.
- Operações mutáveis exigem token CSRF.
- Senhas são protegidas com bcrypt.

## 8) Observações finais

- Esta é a versão protegida, indicada para desenvolvimento e testes de segurança defensivos.
- O uso desta API deve ocorrer com credenciais e origens configuradas corretamente.
