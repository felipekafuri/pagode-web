---
sidebar_position: 6
---

# Advanced Features

## Tasks and Queues

Pagode provides integrated background task processing with queues. This allows you to run operations asynchronously without blocking the main application thread.

### Queues

Tasks can be dispatched to different queues to manage priority and resource allocation. The system uses SQLite for persistent task storage, ensuring tasks aren't lost even if the application restarts.

### Dispatcher

The task dispatcher is included in the service container and can be used to queue up work:

```go
// Queue a task
err := c.Tasks.Queue(ctx, "email", tasks.SendEmailParams{
    To: "user@example.com",
    Subject: "Welcome!",
    Template: "welcome",
})
```

### Monitoring Tasks

The admin panel includes tools for monitoring task queues, viewing failed tasks, and retrying failed tasks when needed.

## Cache

Pagode includes a simple in-memory caching system that can be used to store and retrieve data:

### Set Data

```go
err := c.Cache.Set(ctx, "cache-key", someData, time.Hour)
```

### Get Data

```go
var result SomeType
found, err := c.Cache.Get(ctx, "cache-key", &result)
```

### Flush Data

```go
err := c.Cache.Flush(ctx)
```

## Files and Static Content

Pagode includes systems for handling file uploads and serving static content with appropriate cache headers.

### Cache Control Headers

Static files are served with appropriate cache control headers to optimize browser caching.

### Cache-buster

A cache-busting mechanism is included to ensure that updated static files are properly loaded by browsers after deployments.

## Error Handling

Routes can return errors to indicate that something went wrong and an error page should be rendered for the request. 

```go
return echo.NewHTTPError(http.StatusInternalServerError, "optional message")
```

The error handler is set to the provided `Handler` in `pkg/handlers/error.go` in the `BuildRouter()` function. This handler passes the status code to the `pages.Error` UI component page, allowing you to easily adjust the markup depending on the error type.

## Redirects

The `pkg/redirect` package makes it easy to perform redirects:

```go
return redirect.New(ctx).
    Route("user_profile").
    Params(userID).
    Query(queryParams).
    Go()
```

## Testing

Pagode includes a comprehensive testing setup for routes and components:

### HTTP Server Testing

The route tests initialize a new `Container` which provides full access to all services available during normal application execution. A test HTTP server with the router is also provided, allowing tests to make requests and expect responses exactly as the application would behave in production.

### Request/Response Helpers

Test helpers for making HTTP requests and evaluating responses are available to reduce the amount of code needed for testing:

```go
func TestAbout_Get(t *testing.T) {
    doc := request(t).
        setRoute("about").
        get().
        assertStatusCode(http.StatusOK).
        toDoc()
}
```

## Logging

Structured logging is provided throughout the application. Configuration options allow you to control log levels and output formats for different environments.

## HTTPS

Configuration options are included for running the application with HTTPS in production environments.

## Email

The mail service is included in the container for sending emails:

```go
err := c.Mail.Send(ctx, mail.Email{
    To:       "user@example.com",
    From:     "app@example.com",
    Subject:  "Welcome!",
    Template: "welcome",
    Data:     data,
})
```
