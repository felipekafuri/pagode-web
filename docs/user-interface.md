---
sidebar_position: 5
---

# User Interface

## Why React + InertiaJS?

Modern single-page interactions, rich component ecosystems, and type-safety are now table-stakes for productive web development. By pairing **React 18** with **InertiaJS**, Pagode keeps the simplicity of server-side routing while delivering a fully interactive SPA experience.

- **No separate API layer** – Controllers still live in Go; they just return JSON "page props" for React.
- **Reuse the entire npm ecosystem** – Charts, editors, drag-and-drop, and every other React package drop right in.
- **Zero client-side routing boilerplate** – Inertia intercepts links and form submissions automatically.
- **Typed front-end** – Ship confident UIs with TypeScript and shadcn/ui primitives styled by Tailwind v4.
- **Faster iteration** – Hot-reload for both Go and React via Vite; no template compilation steps.

## Frontend Stack

Pagode's frontend is built with:

- **React**: A declarative library for building interactive UIs
- **Tailwind CSS v4**: A utility-first CSS framework for rapid styling 
- **shadcn/ui**: A beautifully designed component library built on Tailwind and Radix UI
- **InertiaJS**: The bridge connecting your Go backend with your React frontend

This combination gives you the best of both worlds: server-side routing with client-side interactivity, all without building a separate API.

## Routes and Handlers

The router functionality is provided by [Echo](https://echo.labstack.com/guide/routing/) and constructed within the `BuildRouter()` function inside `pkg/handlers/router.go`.

A `Handler` is a simple type that handles one or more of your routes and allows you to group related routes together. All provided handlers are located in `pkg/handlers`. Handlers also self-register their routes with the router.

### Example

Here's a simple example of creating a new handler:

```go
type Example struct {
    orm *ent.Client
}

func init() {
    Register(new(Example))
}

func (e *Example) Init(c *services.Container) error {
    e.orm = c.ORM
    return nil
}

func (e *Example) Routes(g *echo.Group) {
    g.GET("/example", e.Page).Name = routenames.Example
    g.POST("/example", c.PageSubmit).Name = routenames.ExampleSubmit
}

func (e *Example) Page(ctx echo.Context) error {
    // add your code here
}

func (e *Example) PageSubmit(ctx echo.Context) error {
    // add your code here
}
```

## Forms

Building, rendering, validating and processing forms is made extremely easy with Echo binding, validator, and the provided React components.

Start by declaring the form:

```go
type Guestbook struct {
    Message    string `form:"message" validate:"required"`
    form.Submission
}
```

Embedding `form.Submission` satisfies the `form.Form` interface and handles submissions and validation for you.

For form submissions, you can use:

```go
func (e *Example) Submit(ctx echo.Context) error {
    var input forms.Guestbook

    // Submit the form.
    err := form.Submit(ctx, &input)

    // Check the error returned, and act accordingly.
    switch err.(type) {
    case nil:
        // All good!
    case validator.ValidationErrors:
        // The form input was not valid, so re-render the form with the errors included.
        return e.Page(ctx)
    default:
        // Request failed, show the error page.
        return err
    }

    msg.Success(fmt.Sprintf("Your message was: %s", input.Message))

    return redirect.New(ctx).
        Route(routenames.Home).
        Go()
}
```

## Admin Panel

Pagode includes a dynamic admin panel that provides:

- A completely dynamic UI to manage all entities defined by Ent
- A section to monitor all background tasks and queues

Users with admin access will see additional links on the default sidebar. Clicking on the link for any entity type will provide a pageable table of entities and the ability to add/edit/delete.

### Code Generation

In order to automatically provide admin functionality for entities, Pagode uses code generation by leveraging Ent's extension API. A custom extension is provided to generate code that produces flat entity type structs and handler code that work directly with Echo.

### Access Control

Only admin users can access the admin panel. To create an admin user, follow the instructions in the Getting Started section.

## Components and Styling

Pagode uses a combination of server-side components and client-side React components. The frontend styling is powered by Tailwind CSS v4, which provides:

- A utility-first approach for rapid styling
- Built-in responsive design
- Dark mode support
- Easy customization

The shadcn/ui component library provides beautifully designed, accessible components that are ready to use in your application.
