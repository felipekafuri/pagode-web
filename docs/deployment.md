---
sidebar_position: 10
---

# Deployment

This guide covers how to deploy your Pagode application to production environments.

## Preparing for Production

Before deploying your Pagode application, ensure you've taken the following steps:

1. **Update Configuration**

   - Modify `config/config.yaml` with production-appropriate settings
   - Set a secure, random value for `App.EncryptionKey`
   - Configure database settings properly

2. **Build for Production**

   - Use the production build command: `make build`
   - This creates an optimized binary in the `./bin` directory

3. **Environment Variables**
   - Set the `PAGODE_APP_ENVIRONMENT` variable to `production`
   - Override other config settings as needed using environment variables

## Deployment Options

### Docker Deployment

Pagode works well in containerized environments:

```dockerfile
FROM golang:1.21-alpine as builder

WORKDIR /app
COPY . .
RUN go build -o pagode ./cmd/pagode

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/pagode .
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public

EXPOSE 8000
CMD ["./pagode"]
```

Build and run the Docker image:

```bash
docker build -t pagode-app .
docker run -p 8000:8000 -e PAGODE_APP_ENVIRONMENT=production pagode-app
```

### Traditional Hosting

For traditional hosting:

1. Build the binary on your development machine
2. Transfer the binary, configuration files, and static assets to your server
3. Set up a service manager (systemd, supervisor, etc.) to keep the application running

Example systemd service file:

```ini
[Unit]
Description=Pagode Web Application
After=network.target

[Service]
Type=simple
User=pagode
WorkingDirectory=/path/to/pagode
ExecStart=/path/to/pagode/bin/pagode
Restart=on-failure
Environment=PAGODE_APP_ENVIRONMENT=production

[Install]
WantedBy=multi-user.target
```

### Using a Reverse Proxy

In production, it's recommended to use Pagode behind a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handle static files directly
    location /static/ {
        alias /path/to/pagode/public/;
        expires 7d;
    }
}
```

## HTTPS Configuration

For secure communication, enable HTTPS in your configuration:

```yaml
http:
  https: true
  cert: /path/to/cert.pem
  key: /path/to/key.pem
```

If you're using a reverse proxy like Nginx, you can handle HTTPS termination there instead.

## Database Considerations

For production deployments, consider the following for your SQLite database:

1. **Backup Strategy**: Set up regular backups of your `dbs` directory
2. **File Permissions**: Ensure proper permissions for the database files
3. **Disk I/O**: Place the database on SSD storage for better performance
4. **Concurrent Access**: Monitor and tune for concurrent access patterns

If you need to scale beyond what SQLite offers, consider switching to PostgreSQL or another database system supported by Ent.

## Monitoring

For production monitoring:

1. **Logging**: Configure appropriate log levels and consider forwarding logs to a central system
2. **Health Checks**: Implement `/health` endpoints for monitoring services
3. **Metrics**: Consider adding Prometheus metrics for more detailed monitoring

## Security Recommendations

1. **Update the Encryption Key**: Always change the default encryption key in production
2. **Review Middleware**: Ensure security middleware is properly configured
3. **Rate Limiting**: Consider adding rate limiting for login and registration pages
4. **Security Headers**: Configure appropriate security headers in your reverse proxy or directly in Go
