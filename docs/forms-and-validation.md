---
sidebar_position: 8
---

# Forms and Validation

## Form Submission

Building, rendering, validating and processing forms is made extremely easy with [Echo binding](https://echo.labstack.com/guide/binding/), [validator](https://github.com/go-playground/validator), [form.Submission](https://github.com/occult/pagode/blob/main/pkg/form/submission.go), and the provided React components.

Start by declaring the form:

```go
type Guestbook struct {
    Message    string `form:"message" validate:"required"`
    form.Submission
}
```

Embedding `form.Submission` satisfies the `form.Form` interface and handles submissions and validation for you.

Next, provide a method that renders the form with React:

```jsx
function GuestbookForm({ form, csrf }) {
  return (
    <form id="guestbook" method="POST" action="/guestbook">
      <div className="field">
        <label className="label" htmlFor="message">Message</label>
        <div className="control">
          <textarea 
            className={`textarea ${form.errors?.Message ? 'is-danger' : ''}`}
            name="message" 
            value={form.Message || ''}
          />
        </div>
        {form.errors?.Message && (
          <p className="help is-danger">{form.errors.Message}</p>
        )}
      </div>
      
      <div className="field">
        <div className="control">
          <button className="button is-link" type="submit">
            Submit
          </button>
        </div>
      </div>
      
      <input type="hidden" name="_csrf" value={csrf} />
    </form>
  );
}
```

Then, create a page that includes your form:

```jsx
function UserGuestbook({ form }) {
  return (
    <div className="guestbook">
      <h2>My guestbook</h2>
      <p>Hi, please sign my guestbook!</p>
      <GuestbookForm form={form} csrf={csrf} />
    </div>
  );
}
```

And last, have your handler render the page and provide a route for the submission:

```go
func (e *Example) Routes(g *echo.Group) {
    g.GET("/guestbook", e.Page).Name = routenames.Guestbook
    g.POST("/guestbook", c.PageSubmit).Name = routenames.GuestbookSubmit
}

func (e *Example) Page(ctx echo.Context) error {
    return pages.UserGuestbook(ctx, form.Get[forms.Guestbook](ctx))
}
```

`form.Get` will either initialize a new form, or load one previously stored in the context (ie, if it was already submitted).

## Submission Processing

Using the example form above, this is all you would have to do within the _POST_ callback for your route:

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

Here's what happens when you call `form.Submit()`:

1. It stores a pointer to the form in the context so your GET callback can access the form values
2. It parses the input in the POST data to map to the struct fields using the `form` struct tags
3. It validates the values according to the rules provided in the `validate` struct tags

## Inline Validation

The `Submission` makes inline validation easier because it will store all validation errors in a map, keyed by the form struct field name. It also contains helper methods that the form components can use to automatically provide classes and error messages.

The validation uses the popular [validator](https://github.com/go-playground/validator) package, which provides extensive validation options through struct tags.

## CSRF Protection

Cross-Site Request Forgery (CSRF) protection is included by default. The CSRF token is automatically included in forms when you use the proper form components. For React forms, you need to include the hidden CSRF input as shown in the example above.

The CSRF token is available in the request context and can be accessed in your React components through the props passed from the server.
