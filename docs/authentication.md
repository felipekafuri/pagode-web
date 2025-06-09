---
sidebar_position: 4
---

# Authentication

Pagode includes standard authentication features you would expect in any modern web application. Authentication functionality is bundled as a _Service_ within `services/AuthClient` and added to the `Container`. If you wish to handle authentication in a different manner, you could swap this client out or modify it as needed.

Authentication currently requires sessions and the session middleware.

## Sessions

Sessions are provided and handled via [Gorilla sessions](https://github.com/gorilla/sessions) and configured as middleware in the router located at `pkg/handlers/router.go`. Session data is currently stored in cookies but there are many [options](https://github.com/gorilla/sessions#store-implementations) available if you wish to use something else.

Here's a simple example of loading data from a session and saving new values:

```go
func SomeFunction(ctx echo.Context) error {
    sess, err := session.Get(ctx, "some-session-key")
    if err != nil {
        return err
    }
    sess.Values["hello"] = "world"
    sess.Values["isSomething"] = true
    return sess.Save(ctx.Request(), ctx.Response())
}
```

### Encryption

Session data is encrypted for security purposes. The encryption key is stored in configuration at `Config.App.EncryptionKey`. While the default is fine for local development, it is **imperative** that you change this value for any live environment otherwise session data can be compromised.

## Login / Logout

The `AuthClient` has methods `Login()` and `Logout()` to log a user in or out. To track a user's authentication state, data is stored in the session including the user ID and authentication status.

Prior to logging a user in, the method `CheckPassword()` can be used to determine if a user's password matches the hash stored in the database and on the `User` entity.

Routes are provided for the user to login and logout at `user/login` and `user/logout`.

## Forgot Password

Users can reset their password in a secure manner by issuing a new password token via the method `GeneratePasswordResetToken()`. This creates a new `PasswordToken` entity in the database belonging to the user. The actual token itself, however, is not stored in the database for security purposes. It is only returned via the method so it can be used to build the reset URL for the email. Rather, a hash of the token is stored, using `bcrypt` the same package used to hash user passwords.

Tokens have a configurable expiration. By default, they expire within 1 hour. This can be controlled in the `config` package. 

Once a user claims a valid password token, all tokens for that user should be deleted using `DeletePasswordTokens()`.

Routes are provided to request a password reset email at `user/password` and to reset your password at `user/password/reset/token/:user/:password_token/:token`.

## Registration

The actual registration of a user is not handled within the `AuthClient` but rather just by creating a `User` entity. When creating a user, use `HashPassword()` to create a hash of the user's password, which is what will be stored in the database.

A route is provided for the user to register at `user/register`.

## Admins

A checkbox field has been added to the `User` entity type to indicate if the user has admin access. If your app requires a more robust authorization system, such as roles and permissions, you could easily replace this field and adjust all usage of it accordingly. If a user has this field checked, they will be able to access the admin panel. Middleware is provided to easily restrict access to routes based on admin status.

## Authenticated User

The `AuthClient` has two methods available to get either the `User` entity or the ID of the user currently logged in for a given request. Those methods are `GetAuthenticatedUser()` and `GetAuthenticatedUserID()`.

### Middleware

Registered for all routes is middleware that will load the currently logged in user entity and store it within the request context. The middleware is located at `middleware.LoadAuthenticatedUser()` and, if authenticated, the `User` entity is stored within the context using the key `context.AuthenticatedUserKey`.

If you wish to require either authentication or non-authentication for a given route, you can use either `middleware.RequireAuthentication()` or `middleware.RequireNoAuthentication()`.

If you wish to restrict a route to admins only, you can use `middleware.RequireAdmin`.

## Email Verification

Most web applications require the user to verify their email address. The `User` entity has a field `Verified` to indicate if they have verified themselves. When a user successfully registers, an email is sent to them containing a link with a token that will verify their account when visited. This route is accessible at `/email/verify/:token` and handled by `pkg/handlers/auth.go`.

Verification tokens are [JSON Web Tokens](https://jwt.io/) generated and processed by the [jwt](https://github.com/golang-jwt/jwt) module. The tokens are _signed_ using the encryption key stored in configuration (`Config.App.EncryptionKey`). JWT was chosen because they are secure tokens that do not have to be stored in the database, since the tokens contain all of the data required, including built-in expirations.
