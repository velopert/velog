## Running on your machine

These insturctions will get you a copy of the project up and running on your local machine for development or testing purposes.

### Prerequistes

- Node.js v8^
- yarn
- PostgreSQL
- Redis

## Installation

#### 1. Clone the project

```bash
$ git clone https://github.com/velopert/velog.git
```

#### 2. Install packages from npm (both in frontend & backend)

```
$ cd velog-backend
$ yarn
$ cd ../velog-frontend
$ yarn
# if you want to tryout SSR, please do:
$ cd ../velog-ssr
$ yarn
```

#### 3. Rename velog-backend/.env.sample to .env

This file consists environment variables that are needed in backend system.

```
SECRET_KEY=SampleSecretKey
HASH_KEY=SampleHashKey
REDIS_HOST=localhost
REDIS_PASS=
INTERNAL_KEY=d3ae8eef4fd13288d6595e62fe753b12c9dfcb29fb4292f65e1165509c0ba6ea
POSTGRES_HOST=localhost
POSTGRES_USER=velog
POSTGRES_PW=velogpw
NODE_ENV=development
```

- SECRET_KEY: Key used for validating JSON Web Token
- HASH_KEY: Key used for common hashing function
- INTERNAL_KEY: Key used for flushing redis cache

#### 4. Create Database and User

[Creating user, database, and adding access on PostgreSQL](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) is a perfect tutorial for this task. Please read through the article if you are not familar with creating database and user in RDBMS. If you are using macOS, please check [this](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb) article.

```
# Connect to psql
# macOS: psql postgres
# ubuntu: sudo -u postgres psql
$ psql postgres
psql (10.4)
Type "help" for help.

postgres=# CREATE DATABASE velog
  LC_COLLATE 'C'
  LC_CTYPE 'C'
  ENCODING 'UTF8'
  TEMPLATE template0;
CREATE DATABASE
postgres=# CREATE USER velog WITH ENCRYPTED PASSWORD 'velogpw';
CREATE ROLE
postgres=# GRANT ALL PRIVILEGES ON DATABASE velog to velog;
GRANT
```

## Migrate database

```bash
$ cd velog-backend
$ yarn migrate
```

## Start Backend Development Server

```bash
$ cd velog-backend
$ yarn dev
```

## Start Frontend Development Server

Frontend Development server will use localhost backend API server by default (via webpack-dev-server proxy)

```
$ cd velog-frontend
$ yarn start
```
