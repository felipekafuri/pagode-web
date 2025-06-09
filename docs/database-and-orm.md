---
sidebar_position: 3
---

# Database & ORM

## Database

The database currently used is [SQLite](https://sqlite.org/) but you are free to use whatever you prefer. If you plan to continue using [Ent](https://entgo.io/), the ORM, you can check their supported databases [here](https://entgo.io/docs/dialects). The database driver is provided by [go-sqlite3](https://github.com/mattn/go-sqlite3). A reference to the database is included in the `Container` if direct access is required.

Database configuration can be found and managed within the `config` package.

### Auto-migrations

[Ent](https://entgo.io/) provides automatic migrations which are executed on the database whenever the `Container` is created, which means they will run when the application starts.

### Separate Test Database

Since many tests can require a database, Pagode supports a separate database specifically for tests. Within the `config`, the test database can be specified at `Config.Database.TestConnection`, which is the database connection string that will be used. By default, this will be an in-memory SQLite database.

When a `Container` is created, if the environment is set to `config.EnvTest`, the database client will connect to the test database instead and run migrations so your tests start with a clean, ready-to-go database.

## ORM

[Ent](https://entgo.io/) is the supplied ORM. It can be swapped out, but we highly recommend it. There isn't anything comparable for Go at the current time. If you decide to remove Ent, you will lose the dynamic admin panel which allows you to administer all entity types from within the UI.

An Ent client is included in the `Container` to provide easy access to the ORM throughout the application.

Ent relies on code-generation for the entities you create to provide robust, type-safe data operations. Everything within the `ent` directory is generated code for the two entity types listed below except the [schema declaration](https://github.com/occult/pagode/tree/main/ent/schema) and [custom extension](https://github.com/occult/pagode/tree/main/ent/admin) to generate code for the admin panel.

### Entity Types

The two included entity types are:

- User
- PasswordToken

### Creating a New Entity Type

While you should refer to Ent's [documentation](https://entgo.io/docs/getting-started) for detailed usage, here's how to create an entity type and generate code:

1. Ensure all Ent code is downloaded by executing `make ent-install`.
2. Create the new entity type by executing `make ent-new name=User` where `User` is the name of the entity type.
3. Populate the `Fields()` and optionally the `Edges()` (which are the relationships to other entity types).
4. When done, generate all code by executing `make ent-gen`.

The generated code is extremely flexible and impressive. An example to highlight this is:

```go
entity, err := c.ORM.PasswordToken.
    Query().
    Where(passwordtoken.ID(tokenID)).
    Where(passwordtoken.HasUserWith(user.ID(userID))).
    Where(passwordtoken.CreatedAtGTE(expiration)).
    Only(ctx.Request().Context())
```

This executes a database query to return the _password token_ entity with a given ID that belongs to a user with a given ID and has a _created at_ timestamp field that is greater than or equal to a given time.
