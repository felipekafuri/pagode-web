---
sidebar_position: 10
---

# HTMX Integration

Pagode includes full support for [HTMX](https://htmx.org/), a library that allows you to access modern browser features directly from HTML, rather than using JavaScript. This enables powerful frontend interactions with minimal code.

## HTMX Support

HTMX gives you the power of modern browser capabilities with the simplicity of HTML attributes. It's perfect for adding interactive elements without writing complex JavaScript.

### Header Management

Pagode includes utilities for working with HTMX headers. The `Request` type automatically parses HTMX headers when present:

```go
if r.Htmx.Request {
    // This request came from HTMX
    if r.Htmx.Boosted {
        // This was a full page request, boosted by HTMX
    } else {
        // This was a partial content request by HTMX
    }
}
```

### Conditional and Partial Rendering

One of the key benefits of using HTMX is the ability to update only parts of a page without a full refresh. Pagode's rendering system supports this out of the box:

```go
// The Render method automatically checks if the request
// was made by HTMX and only renders the content without 
// the layout if appropriate
return r.Render(layouts.Primary, node)
```

### CSRF Token

If CSRF protection is enabled, the token value will automatically be passed to HTMX to be included in all non-GET requests. This is done by leveraging HTMX events:

```javascript
document.body.addEventListener('htmx:configRequest', function(evt) {
    if (evt.detail.verb !== 'get') {
        evt.detail.headers['X-CSRF-Token'] = csrfToken;
    }
});
```

## HTMX Modal Example

HTMX works great for implementing modals and other interactive components without complex JavaScript:

```html
<button class="button"
        hx-get="/api/modal-content" 
        hx-target="#modal-content"
        hx-trigger="click"
        _="on click add .is-active to #modal">
  Open Modal
</button>

<div id="modal" class="modal">
  <div class="modal-background" _="on click remove .is-active from #modal"></div>
  <div class="modal-content">
    <div id="modal-content">
      <!-- Content will be loaded here by HTMX -->
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" 
          _="on click remove .is-active from #modal"></button>
</div>
```

The server-side handler for this could be as simple as:

```go
func (h *Handler) GetModalContent(ctx echo.Context) error {
    // For HTMX requests, only the inner content is returned
    // (no layout wrapping)
    return ctx.HTML(http.StatusOK, "<div class='box'>Modal content here!</div>")
}
```

## Inline Form Validation

HTMX is particularly powerful for implementing inline form validation:

![Inline validation](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/inline-validation.png)

You can use HTMX to validate form fields as the user types:

```html
<input name="email" 
       hx-post="/validate/email" 
       hx-trigger="change"
       hx-target="next .validation-message" />
<div class="validation-message"></div>
```

The server would respond with validation feedback:

```go
func (h *Handler) ValidateEmail(ctx echo.Context) error {
    email := ctx.FormValue("email")
    if !isValidEmail(email) {
        return ctx.HTML(http.StatusOK, 
            "<span class='text-red-500'>Please enter a valid email address</span>")
    }
    return ctx.HTML(http.StatusOK, 
        "<span class='text-green-500'>Email looks good!</span>")
}
```

## Progressive Enhancement

Pagode's approach with HTMX enables progressive enhancement - your application works even without JavaScript enabled, but provides enhanced interactivity when available. This makes your application more resilient and accessible.
