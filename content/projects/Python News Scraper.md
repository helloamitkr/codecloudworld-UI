---
slug: "python-news-scraper"
title: "Python News Scraper"
stack: ["Python", "FastAPI", "Playwright", "Redis"]
description: "Aggregates tech news with scheduled crawls and a REST API."
github: "https://github.com/example/python-news-scraper"
demo: "https://demo.example.com/python-news-scraper"
difficulty: "Advanced"
category: "Backend"
---

# Python News Scraper

An intelligent news aggregation system that crawls multiple tech news sources, processes articles, and provides a clean REST API for accessing the latest tech news.

## Features

- **Multi-Source Scraping** - Aggregates from HackerNews, TechCrunch, Ars Technica, and more
- **Scheduled Crawling** - Automated news collection every 15 minutes
- **Content Processing** - Extracts clean article text and metadata
- **Duplicate Detection** - Smart deduplication using content similarity
- **Search & Filtering** - Full-text search with category and date filters
- **Rate Limiting** - Respectful crawling with configurable delays
- **Caching Layer** - Redis for high-performance API responses

## Tech Stack

- **Backend**: FastAPI for high-performance async API
- **Scraping**: Playwright for modern web scraping
- **Database**: PostgreSQL for article storage
- **Caching**: Redis for performance optimization
- **Task Queue**: Celery for background job processing
- **Deployment**: Docker with docker-compose

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Scheduler │───▶│   Scraper   │───▶│ PostgreSQL  │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                   │
                          ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ FastAPI     │───▶│    Redis    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## API Endpoints

```bash
# Get latest articles
GET /api/articles?limit=20&offset=0

# Search articles
GET /api/articles/search?q=artificial+intelligence

# Get article by ID
GET /api/articles/{article_id}

# Get articles by source
GET /api/articles?source=hackernews

# Get trending topics
GET /api/trending

# Health check
GET /api/health
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/example/python-news-scraper
cd python-news-scraper

# Start with Docker Compose
docker-compose up -d

# Or run locally
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuration

```python
# config.py
class Settings:
    # Database
    DATABASE_URL = "postgresql://user:pass@localhost/newsdb"
    
    # Redis
    REDIS_URL = "redis://localhost:6379"
    
    # Scraping
    SCRAPE_INTERVAL = 900  # 15 minutes
    MAX_CONCURRENT_REQUESTS = 5
    REQUEST_DELAY = 1.0  # seconds
    
    # Sources
    NEWS_SOURCES = [
        "https://news.ycombinator.com",
        "https://techcrunch.com",
        "https://arstechnica.com"
    ]
```

## Scraping Implementation

```python
# scraper.py
import asyncio
from playwright.async_api import async_playwright

class NewsScraper:
    async def scrape_hackernews(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            await page.goto("https://news.ycombinator.com")
            
            articles = await page.evaluate("""
                () => {
                    const items = document.querySelectorAll('.athing');
                    return Array.from(items).map(item => ({
                        title: item.querySelector('.titleline a')?.textContent,
                        url: item.querySelector('.titleline a')?.href,
                        score: item.nextElementSibling?.querySelector('.score')?.textContent
                    }));
                }
            """)
            
            await browser.close()
            return articles
```

## Data Processing

```python
# processor.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ArticleProcessor:
    def detect_duplicates(self, articles):
        """Detect duplicate articles using content similarity"""
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([a.content for a in articles])
        
        similarity_matrix = cosine_similarity(tfidf_matrix)
        duplicates = []
        
        for i in range(len(articles)):
            for j in range(i + 1, len(articles)):
                if similarity_matrix[i][j] > 0.8:  # 80% similarity threshold
                    duplicates.append((i, j))
        
        return duplicates
```

## Key Learning Points

- **Web Scraping**: Modern scraping with Playwright
- **Async Programming**: FastAPI and asyncio patterns
- **Data Processing**: NLP techniques for deduplication
- **Task Scheduling**: Background jobs with Celery
- **API Design**: RESTful API best practices
- **Caching Strategies**: Redis for performance
- **Docker Deployment**: Multi-container applications

## Monitoring & Analytics

- Request/response metrics
- Scraping success rates
- Article processing statistics
- API performance monitoring

Perfect for developers interested in data engineering, web scraping, and building scalable backend systems!
