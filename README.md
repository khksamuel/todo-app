# Todo App

A full-stack todo application for creating, organising, editing, completing, duplicating, and soft-deleting todos. Categories include a name and colour, which is shown as a ribbon on each todo card.

The project is a single repository with a Spring Boot/MySQL API and a React/Vite web client.

## Features

- Create, edit, duplicate, complete, and soft-delete todos
- Add an optional description, due date, and category to a todo
- Create, edit, filter, and soft-delete categories
- Category-colour ribbons on todo cards
- Demo database setup and seed data
- OpenAPI/Swagger UI for exploring the API
- API integration tests with Rest Assured and H2

## Tech stack

- API: Java 26, Spring Boot, Spring Data JPA, MySQL, Gradle
- Web: React, TypeScript, Vite, Sass, Font Awesome
- Testing: JUnit, Rest Assured, H2, Jest

## Installing

### Prerequisites

- Java 26
- Node.js and npm
- MySQL Server and its command-line client (`mysql`)

### Configure the database

Copy the API environment template and replace the sample values with your local MySQL credentials:

```bat
copy todo-api\.env.example todo-api\.env
```

The expected values are:

```env
DB_URL=jdbc:mysql://localhost:3306/todo_app
DB_USERNAME=todo_user
DB_PASSWORD=change_me
JPA_DDL_AUTO=update
```

`todo-api/.env` is ignored by Git and must not contain real credentials in commits.

### Install web dependencies

```bat
cd todo-web
npm ci
```

## Developing

### Start with demo data

From the repository root:

```bat
run.bat demo
```

This creates or upgrades the `todo_app` schema, then replaces its existing todos and categories with the demo seed data. It starts the API and web client in separate windows.

### Start without resetting data

```bat
run.bat
```

The API is available at `http://localhost:8080`. Vite prints the web client URL in its terminal, normally `http://localhost:5173`.

### Run services separately

```bat
cd todo-api
gradlew.bat bootRun
```

```bat
cd todo-web
npm run dev
```

## Testing

Run the API test suite:

```bat
cd todo-api
gradlew.bat test
```

Run web checks:

```bat
cd todo-web
npx tsc -b
npm run lint
npm run build
```

## Configuration

Database setup is kept in [todo-api/dbsetup.sql](todo-api/dbsetup.sql), with repeat-safe schema upgrades for existing tables. Demo records are defined in [todo-api/seed.sql](todo-api/seed.sql).

The web client calls `/api`; Vite proxies that route to the API using `API_PROXY_TARGET` from `todo-web/.env`. This keeps the API host out of the browser bundle.

## API

Swagger UI is available while the API is running:

<http://localhost:8080/swagger-ui.html>

Main resources:

- `GET`, `POST` `/todos`
- `GET`, `PATCH`, `DELETE` `/todos/{id}`
- `GET` `/todos/{id}/done`
- `GET` `/todos/deleted`
- `GET`, `POST` `/categories`
- `PATCH`, `DELETE` `/categories/{id}`

See Swagger UI for the complete API, including soft-deletion and permanent-deletion endpoints.

## Project structure

```text
todo-app/
├── todo-api/       Spring Boot API, SQL setup, and integration tests
├── todo-web/       React TypeScript client
├── run.bat         Builds and starts both applications
└── test.bat        Project test helper
```

## Contributing

1. Create a branch for your change.
2. Keep API and web changes focused and use descriptive commits.
3. Run the relevant tests and checks before opening a pull request.
4. Do not commit `.env` files or database credentials.

## Links

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [MySQL](https://www.mysql.com/)

## License

No license has been selected yet. Add a license file before distributing or accepting external contributions.
