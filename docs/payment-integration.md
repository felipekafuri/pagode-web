---
sidebar_position: 7
---

# Payment Integration

Pagode includes a comprehensive payment integration system built on Stripe, supporting both subscription-based payments and one-time purchases. The implementation follows security best practices with PCI-compliant payment processing.

## Overview

The payment system provides:

- **Subscription Management**: Recurring billing with monthly/yearly plans
- **One-time Payments**: Product purchases with immediate access
- **Premium Content Protection**: Middleware-based access control
- **Secure Processing**: PCI-compliant with Stripe Elements
- **Database Entities**: Complete payment data modeling with Ent ORM

## Architecture

### Service Container Integration

The payment system is fully integrated with Pagode's service container pattern:

```go
type Container struct {
    // ... other services
    Payment *PaymentClient  // Payment service client
    ORM     *ent.Client     // Database access for payment entities
}
```

### Provider Abstraction

The payment system uses a provider pattern for easy extensibility:

```go
type PaymentProvider interface {
    CreateCustomer(ctx context.Context, params CreateCustomerParams) (*Customer, error)
    CreatePaymentIntent(ctx context.Context, params CreatePaymentIntentParams) (*PaymentIntent, error)
    CreateSubscription(ctx context.Context, params CreateSubscriptionParams) (*Subscription, error)
    AttachPaymentMethod(ctx context.Context, params AttachPaymentMethodParams) error
}
```

Currently implements:
- **StripeProvider**: Full Stripe integration
- Easily extensible for other providers (PayPal, Square, etc.)

## Configuration

### Environment Setup

Configure payment settings in `config/config.yaml`:

```yaml
payment:
  provider: "stripe"
  stripe:
    secretKey: "sk_test_your_stripe_secret_key_here"
    publishableKey: "pk_test_your_stripe_publishable_key_here"
    webhookSecret: "whsec_your_webhook_secret_here"
    currency: "usd"
```

### Environment Variables

For production, use environment variables:

```bash
export PAGODA_PAYMENT_STRIPE_SECRETKEY="sk_live_..."
export PAGODA_PAYMENT_STRIPE_PUBLISHABLEKEY="pk_live_..."
export PAGODA_PAYMENT_STRIPE_WEBHOOKSECRET="whsec_..."
```

### Stripe Setup

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: From Stripe Dashboard → Developers → API keys
3. **Create Products**: Set up products and prices in Stripe Dashboard
4. **Configure Webhooks**: Set up webhook endpoints for payment status updates

## Database Entities

The payment system uses four main Ent entities:

### PaymentCustomer

Links users to Stripe customers:

```go
// Links user to payment provider customer
type PaymentCustomer struct {
    ID               int    `json:"id"`
    UserID           int    `json:"user_id"`
    StripeCustomerID string `json:"stripe_customer_id"`
    CreatedAt        time.Time `json:"created_at"`
}
```

### PaymentMethod

Stores payment method metadata (no sensitive card data):

```go
type PaymentMethod struct {
    ID                     int    `json:"id"`
    CustomerID             int    `json:"customer_id"`
    ProviderPaymentMethodID string `json:"provider_payment_method_id"`
    Type                   string `json:"type"` // "card", etc.
    IsDefault              bool   `json:"is_default"`
}
```

### Subscription

Tracks subscription status and billing:

```go
type Subscription struct {
    ID         int    `json:"id"`
    CustomerID int    `json:"customer_id"`
    Status     string `json:"status"` // "active", "canceled", etc.
    PriceID    string `json:"price_id"`
    CreatedAt  time.Time `json:"created_at"`
}
```

### PaymentIntent

Handles one-time payments:

```go
type PaymentIntent struct {
    ID                        int    `json:"id"`
    CustomerID                int    `json:"customer_id"`
    ProviderPaymentIntentID   string `json:"provider_payment_intent_id"`
    Amount                    int64  `json:"amount"`
    Status                    string `json:"status"` // "succeeded", "failed", etc.
}
```

## Routes and Pages

### Payment Routes

The system includes several payment-related routes:

- **`/plans`** - Subscription plans and signup
- **`/products`** - One-time product purchases  
- **`/premium`** - Protected premium content
- **`/billing`** - Subscription and payment method management

### Route Handlers

Payment handlers follow Pagode's standard pattern:

```go
type Plans struct {
    Inertia *inertia.Inertia
    Payment *services.PaymentClient
    Auth    *services.AuthClient
}

func (h *Plans) Routes(g *echo.Group) {
    authGroup := g.Group("")
    authGroup.Use(middleware.RequireAuthentication)
    
    authGroup.GET("/plans", h.Page).Name = routenames.Plans
    authGroup.POST("/plans/subscribe", h.Subscribe).Name = routenames.PlansSubscribe
}
```

## Frontend Integration

### React Components

The frontend uses React with InertiaJS for seamless payment processing:

#### PaymentForm Component

Secure card collection using Stripe Elements:

```tsx
<PaymentForm
  plan={{
    id: "premium",
    name: "Premium Plan",
    price: 2999,
    currency: "usd",
  }}
  onSubmit={handlePaymentSubmit}
  isProcessing={processing}
  stripePublishableKey={stripePublishableKey}
  mode="subscription" // or "payment"
/>
```

#### Mode Support

The PaymentForm component supports two modes:

- **`subscription`**: Shows "Subscribe for $29.99/month"
- **`payment`**: Shows "Pay $29.99" for one-time purchases

### Form Handling

Payment forms use Inertia's form handling:

```tsx
const handlePaymentSubmit = (paymentMethodId: string) => {
  router.post('/plans/subscribe', {
    planId: selectedPlan.id,
    paymentMethodId: paymentMethodId,
  }, {
    onSuccess: () => {
      setShowPaymentModal(false);
    },
    onError: (errors) => {
      console.error('Payment failed:', errors);
    },
  });
};
```

## Premium Content Protection

### Middleware

Protect routes requiring payment with `RequirePaidUser` middleware:

```go
func (h *Premium) Routes(g *echo.Group) {
    authGroup := g.Group("")
    authGroup.Use(middleware.RequireAuthentication)
    authGroup.Use(middleware.RequirePaidUser(h.ORM))
    
    authGroup.GET("/premium", h.Page).Name = routenames.Premium
}
```

### Access Control Logic

The middleware checks for:

1. **Active Subscriptions**: `subscription.StatusActive`
2. **Successful Payments**: `paymentintent.StatusSucceeded`

If neither condition is met, users are redirected to purchase pages with a warning message.

### Database Queries

The middleware uses efficient Ent queries:

```go
// Check for active subscription
hasActiveSubscription, err := db.Subscription.
    Query().
    Where(subscription.HasCustomerWith(
        paymentcustomer.HasUserWith(entuser.IDEQ(user.ID)),
    )).
    Where(subscription.StatusEQ(subscription.StatusActive)).
    Exist(ctx)

// Check for successful payment intent
hasSuccessfulPayment, err := db.PaymentIntent.
    Query().
    Where(paymentintent.HasCustomerWith(
        paymentcustomer.HasUserWith(entuser.IDEQ(user.ID)),
    )).
    Where(paymentintent.StatusEQ(paymentintent.StatusSucceeded)).
    Exist(ctx)
```

## Payment Processing Flow

### Subscription Flow

1. User selects plan from `/plans` page
2. Payment modal opens with PaymentForm component
3. User enters payment details via Stripe Elements
4. Frontend creates payment method using Stripe.js
5. Payment method ID is sent to backend
6. Backend creates/retrieves customer
7. Backend attaches payment method to customer
8. Backend creates subscription with Stripe
9. Database entities are updated
10. User gains access to premium content

### One-time Payment Flow

1. User navigates to `/products` page
2. Clicks "Purchase Now" for a product
3. Payment modal opens with product details
4. User enters payment details
5. Backend creates payment intent
6. Payment is processed immediately
7. User gains access to premium content

## Security Best Practices

### PCI Compliance

- **No sensitive card data** stored in database
- **Stripe Elements** handles all card data collection
- **Payment method IDs** used instead of raw card numbers
- **Server-side validation** for all payment operations

### Data Protection

- **Authentication required** for all payment endpoints
- **User-specific payment methods** and subscriptions
- **CSRF protection** enabled by default
- **Input validation** using struct tags and middleware

### Error Handling

- **Comprehensive error responses** with user-friendly messages
- **Stripe webhook integration** for payment status updates
- **Database transaction safety** with rollback on failures
- **Structured logging** for debugging and monitoring

## Testing

### Test Environment

The payment system automatically uses Stripe test mode in development:

- Test credentials are clearly marked with `sk_test_` and `pk_test_` prefixes
- No real money is processed
- Full payment flow testing available

### Test Cards

Use these Stripe test cards for different scenarios:

```
Success:              4242 4242 4242 4242
Declined:             4000 0000 0000 0002
Requires Auth:        4000 0025 0000 3155
Insufficient Funds:   4000 0000 0000 9995
```

### Testing Commands

```bash
# Run all tests including payment integration
make test

# Start application for manual testing
make run

# Create admin user for testing
make admin email=test@example.com
```

## Monitoring and Admin

### Admin Panel

The admin panel provides payment monitoring tools:

- **Payment Customers**: View customer records and Stripe IDs
- **Payment Methods**: Monitor attached payment methods
- **Subscriptions**: Track subscription status and billing
- **Payment Intents**: View one-time payment history

### Error Monitoring

Payment errors are logged with structured logging:

```go
log.Ctx(c).Warn("Payment processing failed", 
    "user_id", user.ID,
    "error", err.Error(),
    "payment_intent_id", paymentIntent.ID)
```

### Webhook Handling

Configure Stripe webhooks for real-time payment updates:

- **Payment succeeded**: Update payment intent status
- **Subscription updated**: Sync subscription changes
- **Payment failed**: Handle failed payments
- **Customer updated**: Sync customer information

## Deployment Considerations

### Environment Variables

In production, use environment variables for sensitive data:

```bash
# Never commit these to version control
PAGODA_PAYMENT_STRIPE_SECRETKEY=sk_live_...
PAGODA_PAYMENT_STRIPE_PUBLISHABLEKEY=pk_live_...
```

### Database Migrations

Payment entities are included in automatic migrations:

```bash
# Migrations run automatically on startup
make run
```

### SSL/HTTPS

Always use HTTPS in production for payment processing:

```yaml
# config/config.yaml
http:
  tls:
    enabled: true
    cert: "/path/to/cert.pem"
    key: "/path/to/key.pem"
```

## Extending the Payment System

### Adding New Providers

Implement the `PaymentProvider` interface:

```go
type CustomProvider struct {
    // Provider-specific configuration
}

func (p *CustomProvider) CreateCustomer(ctx context.Context, params CreateCustomerParams) (*Customer, error) {
    // Custom implementation
}

// Implement other required methods...
```

### Custom Payment Flows

Extend handlers for custom payment logic:

```go
func (h *CustomPayment) ProcessPayment(ctx echo.Context) error {
    // Custom payment processing logic
    customer, err := h.Payment.CreateOrGetCustomer(ctx, user)
    if err != nil {
        return err
    }
    
    // Custom business logic here
    
    return h.Inertia.Render(ctx.Response().Writer, ctx.Request(), "Success", props)
}
```

### Integration with External Services

The payment system integrates well with other Pagode services:

```go
// Send confirmation email after payment
err := c.Mail.Send(ctx, mail.Email{
    To:       user.Email,
    Template: "payment_confirmation",
    Data:     paymentData,
})

// Queue background tasks
err := c.Tasks.Queue(ctx, "update_user_permissions", tasks.UpdatePermissionsParams{
    UserID: user.ID,
    Status: "premium",
})
```

This comprehensive payment integration provides a solid foundation for monetizing your Pagode application while maintaining security, scalability, and user experience standards.