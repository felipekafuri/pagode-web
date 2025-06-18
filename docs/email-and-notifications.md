---
sidebar_position: 11
---

# Email and Notifications

Pagode includes a flexible system for sending emails and notifications to users.

## Email Service

The email service is provided as part of the application container and can be easily accessed from anywhere in your application:

```go
err := c.Mail.Send(ctx, mail.Email{
    To:       "user@example.com",
    From:     "app@example.com",
    Subject:  "Welcome!",
    Template: "welcome",
    Data:     data,
})
```

## Email Templates

Pagode supports templated emails using Go's built-in templating system. Templates are stored in a configurable location and can include both text and HTML versions.

Example template structure:

```
templates/
├── emails/
│   ├── welcome/
│   │   ├── html.tmpl
│   │   └── text.tmpl
│   ├── password_reset/
│   │   ├── html.tmpl
│   │   └── text.tmpl
│   └── verification/
│       ├── html.tmpl
│       └── text.tmpl
```

## User Verification Emails

When a user registers, you can automatically send them an email verification link:

```go
// Generate a verification token
token, err := c.Auth.GenerateEmailVerificationToken(user.Email)
if err != nil {
    return err
}

// Build the verification URL
verifyURL := r.Url("verify_email", token)

// Send the verification email
err = c.Mail.Send(ctx.Request().Context(), mail.Email{
    To:       user.Email,
    Subject:  "Verify your email address",
    Template: "verification",
    Data: map[string]interface{}{
        "User":      user,
        "VerifyURL": verifyURL,
    },
})
```

The verification route handler would look something like:

```go
func (h *Auth) VerifyEmail(ctx echo.Context) error {
    token := ctx.Param("token")

    // Validate the token
    email, err := h.container.Auth.ValidateEmailVerificationToken(token)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid or expired verification token")
    }

    // Find the user by email
    user, err := h.container.ORM.User.
        Query().
        Where(user.Email(email)).
        Only(ctx.Request().Context())
    if err != nil {
        return err
    }

    // Update the user as verified
    _, err = user.Update().
        SetVerified(true).
        Save(ctx.Request().Context())
    if err != nil {
        return err
    }

    // Show success message
    flash.Success(ctx, "Your email has been verified!")

    // Redirect to login
    return redirect.New(ctx).
        Route(routenames.Login).
        Go()
}
```

## Password Reset Emails

For password reset functionality, a similar pattern is used:

```go
// Generate a password reset token
token, err := c.Auth.GeneratePasswordResetToken(user)
if err != nil {
    return err
}

// Build the reset URL with the token
resetURL := r.Url("password_reset", user.ID, token.ID, token.Token)

// Send the email
err = c.Mail.Send(ctx.Request().Context(), mail.Email{
    To:       user.Email,
    Subject:  "Reset your password",
    Template: "password_reset",
    Data: map[string]interface{}{
        "User":     user,
        "ResetURL": resetURL,
    },
})
```

## Configuration

Email settings can be configured in the `config/config.yaml` file:

```yaml
mail:
  from: no-reply@example.com
  name: Your App Name
  smtp:
    host: smtp.example.com
    port: 587
    username: mailuser
    password: mailpass
  templates: ./templates/emails
```

## Flash Notifications

In addition to emails, Pagode includes a flash messaging system for temporary notifications to users between requests:

```go
// Set a success message
flash.Success(ctx, "Your changes have been saved!")

// Set an error message
flash.Error(ctx, "Something went wrong!")

// Set an info message
flash.Info(ctx, "Please check your email for verification.")
```

These messages will be automatically available in the next request and can be displayed in your templates.
