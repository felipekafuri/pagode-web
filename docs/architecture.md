---
sidebar_position: 2
---

# Architecture

## Service Container

The container is located at `pkg/services/container.go` and is meant to house all of your application's services and/or dependencies. It is easily extensible and can be created and initialized in a single call. The services currently included in the container are:

- Authentication
- Cache
- Configuration
- Database
- Files
- Graph
- Mail
- ORM
- Tasks
- Validator
- Web

A new container can be created and initialized via `services.NewContainer()`. It can be later shutdown via `Shutdown()`, which will attempt to gracefully shutdown all services.

### Dependency Injection

The container exists to facilitate easy dependency-injection both for services within the container and areas of your application that require any of these dependencies. For example, the container is automatically passed to the `Init()` method of your route handlers so that the handlers have full, easy access to all services.

### Test Dependencies

It is common that your tests will require access to dependencies, like the database, or any of the other services available within the container. Keeping all services in a container makes it especially easy to initialize everything within your tests.

## Configuration

The `config` package provides a flexible, extensible way to store all configuration for the application. Configuration is added to the `Container` as a _Service_, making it accessible across most of the application.

### Environment Overrides

Leveraging the functionality of [viper](https://github.com/spf13/viper) to manage configuration, all configuration values can be overridden by environment variables. The name of the variable is determined by the set prefix and the name of the configuration field in `config/config.yaml`.

In `config/config.go`, the prefix is set as `pagoda` via `viper.SetEnvPrefix("pagoda")`. Nested fields require an underscore between levels. For example:

```yaml
http:
  port: 1234
```

can be overridden by setting an environment variable with the name `PAGODA_HTTP_PORT`.

### Environments

The configuration value for the current _environment_ (`Config.App.Environment`) is an important one as it can influence some behavior significantly.

A helper function (`config.SwitchEnvironment`) is available to make switching the environment easy, but this must be executed prior to loading the configuration. The common use-case for this is to switch the environment to `Test` before tests are executed.

## Screenshots

### Inline Form Validation
![Inline validation](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/inline-validation.png)

### User Registration
![Registration](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/register.png)

### Modal with HTMX AJAX Request
![Alpine and HTMX](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/modal.png)

### Admin Panel - User List
![User entity list](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/admin-user_list.png)

### Admin Panel - User Edit
![User entity edit](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/admin-user_edit.png)

### Task Queue Management
![Manage task queues](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/backlite/failed.png)
