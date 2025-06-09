---
sidebar_position: 14
---

# Caching

Pagode includes a robust caching system to improve performance and reduce database load. The cache service is available through the application container.

## Cache Service

The cache is implemented as an in-memory solution by default, but the interface is designed to be easily swappable with other implementations if needed.

## Set Data

To store data in the cache:

```go
// Cache data with a 1 hour expiration
err := c.Cache.Set(ctx, "cache-key", someData, time.Hour)

// Cache data with tags for selective invalidation
err := c.Cache.SetWithTags(ctx, "user-profile-123", profileData, time.Hour, []string{"users", "profiles"})
```

## Get Data

To retrieve data from the cache:

```go
var result SomeType
found, err := c.Cache.Get(ctx, "cache-key", &result)

if found {
    // Use the cached data
} else {
    // Cache miss - fetch the data and cache it
    result = fetchExpensiveData()
    c.Cache.Set(ctx, "cache-key", result, time.Hour)
}
```

## Flush Data

To remove specific keys or flush the entire cache:

```go
// Remove a specific key
err := c.Cache.Delete(ctx, "cache-key")

// Flush the entire cache
err := c.Cache.Flush(ctx)
```

## Flush Tags

One of the most powerful features of the caching system is tag-based invalidation. This allows you to invalidate groups of related cache entries at once:

```go
// Invalidate all cache entries with the "users" tag
err := c.Cache.FlushTags(ctx, []string{"users"})
```

This is particularly useful when updating entities - you can invalidate all cache entries related to that entity type.

## Practical Example

Here's a complete example of using the cache for an expensive database query:

```go
func (h *Handler) GetPopularProducts(ctx echo.Context) error {
    var products []Product
    cacheKey := "popular-products"
    
    // Try to get from cache
    found, err := h.container.Cache.Get(ctx.Request().Context(), cacheKey, &products)
    if err != nil {
        return err
    }
    
    if !found {
        // Cache miss - fetch from database
        products, err = h.container.ORM.Product.
            Query().
            Where(product.Featured(true)).
            Order(ent.Desc(product.FieldViewCount)).
            Limit(10).
            All(ctx.Request().Context())
        
        if err != nil {
            return err
        }
        
        // Store in cache for 1 hour
        err = h.container.Cache.SetWithTags(
            ctx.Request().Context(),
            cacheKey,
            products,
            time.Hour,
            []string{"products", "featured"},
        )
        
        if err != nil {
            // Log cache error but continue (non-fatal)
            log.Printf("Cache error: %v", err)
        }
    }
    
    return ctx.JSON(http.StatusOK, products)
}
```

## Node Caching for UI Components

For UI components, Pagode also includes a node caching system to avoid redundant rendering of unchanged components. This is particularly useful for complex components that don't change frequently.

## Configuration

Cache settings can be configured in `config/config.yaml`:

```yaml
cache:
  # Default expiration for items without explicit TTL
  expiration: 10m
  
  # Controls whether caching is enabled
  enabled: true
```

## Cache Headers for Static Files

In addition to application-level caching, Pagode configures appropriate cache-control headers for static files to optimize browser caching:

```go
// Set cache headers for 7 days
func setCacheHeaders(next echo.HandlerFunc) echo.HandlerFunc {
    return func(ctx echo.Context) error {
        ctx.Response().Header().Set("Cache-Control", "public, max-age=604800")
        return next(ctx)
    }
}
```

This ensures that static resources like CSS, JavaScript, and images are efficiently cached by browsers.
