---
sidebar_position: 7
---

# Routes and Middleware

## Router

The router functionality is provided by [Echo](https://echo.labstack.com/guide/routing/) and constructed via the `BuildRouter()` function inside `pkg/handlers/router.go`. Since the Echo instance is a Service on the Container which is passed in to `BuildRouter()`, middleware and routes can be added directly to it.

## Custom Middleware

By default, a middleware stack is included in the router that makes sense for most web applications. Be sure to review what has been included and what else is available within Echo and the other projects mentioned.

A `middleware` package is included which you can easily add to along with the custom middleware provided.

## Handlers

A `Handler` is a simple type that handles one or more of your routes and allows you to group related routes together (ie, authentication). All provided handlers are located in `pkg/handlers`. Handlers also handle self-registering their routes with the router.

It is highly recommended that you provide a `Name` for your routes. Most methods on the back and frontend leverage the route name and parameters in order to generate URLs. All route names are currently stored as consts in the `routenames` package so they are accessible from within the `ui` layer.

```go
func (e *Example) Routes(g *echo.Group) {
    g.GET("/example", e.Page).Name = routenames.Example
    g.POST("/example", c.PageSubmit).Name = routenames.ExampleSubmit
}
```

## Errors

Routes can return errors to indicate that something wrong happened and an error page should be rendered for the request. Ideally, the error is of type `*echo.HTTPError` to indicate the intended HTTP response code, and optionally a message that will be logged:

```go
return echo.NewHTTPError(http.StatusInternalServerError, "optional message")
```

If an error of a different type is returned, an Internal Server Error is assumed.

The error handler is set to the provided `Handler` in `pkg/handlers/error.go` in the `BuildRouter()` function. That means that if any middleware or route return an error, the request gets routed there. This route passes the status code to the `pages.Error` UI component page, allowing you to easily adjust the markup depending on the error type.

## Redirects

The `pkg/redirect` package makes it easy to perform redirects, especially if you provide names for your routes. The `Redirect` type provides the ability to chain redirect options and also supports automatically handling HTMX redirects for boosted requests.

For example, if your route name is `user_profile` with a URL pattern of `/user/profile/:id`, you can perform a redirect by doing:

```go
return redirect.New(ctx).
    Route("user_profile").
    Params(userID).
    Query(queryParams).
    Go()
```

## Testing

Since most of your web application logic will live in your routes, being able to easily test them is important.

### HTTP Server

When the route tests initialize, a new `Container` is created which provides full access to all the Services that will be available during normal application execution. Also provided is a test HTTP server with the router added. This means your tests can make requests and expect responses exactly as the application would behave outside of tests. You do not need to mock the requests and responses.

### Request / Response Helpers

With the test HTTP server setup, test helpers for making HTTP requests and evaluating responses are made available to reduce the amount of code you need to write. See `httpRequest` and `httpResponse` within `pkg/handlers/router_test.go`.

```go
func TestAbout_Get(t *testing.T) {
    doc := request(t).
        setRoute("about").
        get().
        assertStatusCode(http.StatusOK).
        toDoc()
}
```

### Goquery

A helpful, included package to test HTML markup from HTTP responses is [goquery](https://github.com/PuerkitoBio/goquery). This allows you to use jQuery-style selectors to parse and extract HTML values, attributes, and so on.

In the example above, `toDoc()` will return a `*goquery.Document` created from the HTML response of the test HTTP server.

```go
h1 := doc.Find("h1.title")
assert.Len(t, h1.Nodes, 1)
assert.Equal(t, "About", h1.Text())
```
