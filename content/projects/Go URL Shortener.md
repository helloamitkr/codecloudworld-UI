---
slug: "go-url-shortener"
title: "Go URL Shortener"
stack: ["Go", "Chi", "PostgreSQL", "Docker"]
description: "A production-ready URL shortener with click analytics and expiring links."
github: "https://github.com/example/go-url-shortener"
demo: "https://demo.example.com/go-url-shortener"
difficulty: "Intermediate"
category: "Backend"
---

# Go URL Shortener

A production-ready URL shortener service built with Go, featuring click analytics, expiring links, and a clean REST API.

## Features

- **Short URL Generation** - Convert long URLs to short, shareable links
- **Click Analytics** - Track clicks, referrers, and geographic data
- **Expiring Links** - Set custom expiration dates for URLs
- **Custom Aliases** - Create memorable short URLs
- **Rate Limiting** - Prevent abuse with configurable limits
- **Docker Support** - Easy deployment with Docker containers

## Tech Stack

- **Backend**: Go with Chi router
- **Database**: PostgreSQL for data persistence
- **Caching**: Redis for high-performance lookups
- **Deployment**: Docker & Docker Compose
- **Testing**: Go's built-in testing framework

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│  Go Server  │───▶│ PostgreSQL  │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │    Redis    │
                   └─────────────┘
```

## API Endpoints

```bash
# Create short URL
POST /api/shorten
{
  "url": "https://example.com/very-long-url",
  "alias": "custom-name",
  "expires_at": "2024-12-31T23:59:59Z"
}

# Get URL info
GET /api/urls/{shortCode}

# Redirect to original URL
GET /{shortCode}

# Get analytics
GET /api/analytics/{shortCode}
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/example/go-url-shortener
cd go-url-shortener

# Start with Docker Compose
docker-compose up -d

# Or run locally
go mod download
go run cmd/server/main.go
```

## Key Learning Points

- RESTful API design in Go
- Database modeling and migrations
- Caching strategies with Redis
- Docker containerization
- Testing HTTP handlers
- Rate limiting implementation

Perfect for developers looking to build scalable backend services with Go!
