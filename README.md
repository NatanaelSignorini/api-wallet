# teste-backend

## Description

Api de Carteira financeira.

Financial Wallet API.

## Prerequisites

Você precisará do Docker. Então se não tiver o Docker clique [Aqui](https://docs.docker.com/install/) e instale-o.
Com o Docker instalado, clone este repositório e abra-o. No terminal:

You will need Docker. So if don't have Docker click [Here](https://docs.docker.com/install/) and install it.
With Docker installed, clone this repository and open it. In terminal type:

```bash
# installation database
docker-compose up

```

Para adicionar usuários

```bash
# run seed
$ yarn migration:run
```

## Running the Tests

```bash
# unit tests
$ yarn run test or npm run test

```

### Built With

As seguintes ferramentas foram utilizadas na construção do projeto:

The following tools were used in building the project:

- [NestJs](https://nestjs.com/) - The framework NestJs used.
- [TypeScript](https://www.typescriptlang.org/) - The TypeScript used.
- [TypeOrm](https://typeorm.io/) - The TypeOrm used.
- [PostgreSQL](https://www.postgresql.org/) - The database Postegres used.
- [BcryptJs](https://www.npmjs.com/package/bcryptjs) - The cryptography Bcrypt used.
- [Swagger](https://swagger.io/) - The swagger used.
- [Jwt](https://jwt.io/) - The JSON Web Tokens used.
- [Winston](https://github.com/winstonjs/winston) - The Winston used.
- [Docker](https://www.docker.com/) - The Docker used.
