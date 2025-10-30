# Content Management System

This project uses a modern, maintainable content management system built exclusively on Markdown files with YAML frontmatter. All content is now managed through markdown files - no JSON configuration required.

## 📁 Structure

```
content/
├── blogs/           # Blog posts
├── courses/         # Course content
└── projects/        # Project showcases

src/lib/
├── content.js       # Core content management class
└── content-helpers.js # Helper functions and utilities

scripts/
└── create-content.js # CLI tool for creating new content
```

## 🚀 Quick Start

### Adding New Content

Use the CLI tool to create new content:

```bash
# Create a new blog post
node scripts/create-content.js blog "My Awesome Tutorial"

# Create a new course
node scripts/create-content.js course "Advanced React Patterns"

# Create a new project
node scripts/create-content.js project "Full Stack E-commerce App"
```

### Manual Creation

Create a new `.md` file in the appropriate directory:

```markdown
---
slug: "my-post-slug"
title: "My Post Title"
date: "2025-10-30"
excerpt: "Brief description"
tags: ["tutorial", "javascript"]
---

# My Post Title

Your content here with **markdown** formatting!

```javascript
function example() {
  console.log("Code blocks work perfectly!");
}
```
```

## 📝 Content Types

### Blogs (`content/blogs/`)

**Required frontmatter:**
- `slug`: URL-safe identifier
- `title`: Post title
- `date`: Publication date
- `excerpt`: Brief description
- `read`: Reading time (e.g., "5 min")

**Optional frontmatter:**
- `tags`: Array of tags
- `author`: Author name
- `featured`: Boolean for featured posts
- `draft`: Boolean for draft posts

### Courses (`content/courses/`)

**Required frontmatter:**
- `slug`: URL-safe identifier
- `title`: Course title
- `level`: Difficulty level
- `description`: Course description

**Optional frontmatter:**
- `tag`: Primary technology/topic
- `duration`: Estimated time
- `lessons`: Number of lessons
- `featured`: Boolean for featured courses

### Projects (`content/projects/`)

**Required frontmatter:**
- `slug`: URL-safe identifier
- `title`: Project title
- `stack`: Array of technologies
- `description`: Project description

**Optional frontmatter:**
- `github`: GitHub repository URL
- `demo`: Live demo URL
- `difficulty`: Project difficulty
- `category`: Project category
- `featured`: Boolean for featured projects

## 🛠️ API Reference

### ContentManager Class

```javascript
import { blogManager, courseManager, projectManager } from './src/lib/content';

// Get all items
const blogs = blogManager.getAllItems();

// Get single item
const post = await blogManager.getItemBySlug('my-post-slug');

// Search items
const results = blogManager.searchItems('javascript');

// Create new item
blogManager.createItem('new-slug', frontmatter, content);
```

### Helper Functions

```javascript
import { 
  getAllItems, 
  getItemBySlug, 
  searchAllContent,
  getRecentItems,
  getFeaturedItems 
} from './src/lib/content-helpers';

// Get all blogs
const blogs = getAllItems('blogs');

// Get single course
const course = await getItemBySlug('courses', 'react-basics');

// Search across all content types
const results = searchAllContent('javascript');

// Get recent items from all types
const recent = getRecentItems(10);

// Get featured items
const featured = getFeaturedItems();
```

## 🎨 Features

### ✅ What's Included

- **Pure Markdown**: All content managed through markdown files only
- **No JSON Dependencies**: Eliminated all JSON-based content configuration
- **Code Syntax Highlighting**: Automatic highlighting with Prism.js
- **Frontmatter Validation**: Built-in validation for required fields
- **Search Functionality**: Full-text search across all content
- **Static Generation**: All content is statically generated at build time
- **Type Safety**: TypeScript-ready with proper type definitions
- **CLI Tools**: Easy content creation with command-line tools
- **Flexible Structure**: Easy to extend for new content types

### 🔧 Advanced Features

- **Content Relationships**: Link between different content types
- **Tag-based Filtering**: Filter content by tags or categories
- **Featured Content**: Mark content as featured for special display
- **Draft Support**: Create draft content that won't be published
- **Automatic Slug Generation**: Generate URL-safe slugs from titles
- **Content Statistics**: Get insights about your content

## 📊 Content Statistics

Get insights about your content:

```javascript
import { getContentStats } from './src/lib/content-helpers';

const stats = getContentStats();
console.log(stats);
// {
//   blogs: { total: 5, published: 4, drafts: 1, featured: 2 },
//   courses: { total: 2, published: 2, drafts: 0, featured: 1 },
//   projects: { total: 3, published: 3, drafts: 0, featured: 1 }
// }
```

## 🔍 Search & Filtering

### Search All Content

```javascript
import { searchAllContent } from './src/lib/content-helpers';

const results = searchAllContent('react');
// Returns: { blogs: [...], courses: [...], projects: [...] }
```

### Filter by Tags

```javascript
import { getItemsByTag } from './src/lib/content-helpers';

const reactContent = getItemsByTag('react');
// Returns all content tagged with 'react'
```

## 🚀 Deployment

The system works with any static site generator or hosting platform:

1. **Build**: `npm run build`
2. **Deploy**: Upload the generated files to your hosting platform

All content is pre-rendered at build time for optimal performance.

## 🔧 Extending the System

### Adding New Content Types

1. Create a new directory in `content/`
2. Add configuration to `CONTENT_TYPES` in `content-helpers.js`
3. Create pages in `src/pages/` following the existing pattern

### Custom Validation

Add custom validation rules in `validateContentItem()`:

```javascript
if (contentType === 'tutorials') {
  if (!data.difficulty) errors.push('difficulty is required for tutorials');
}
```

## 📈 Performance

- **Static Generation**: All content is pre-rendered at build time
- **Optimized Images**: Automatic image optimization (if configured)
- **Code Splitting**: Automatic code splitting for optimal loading
- **SEO Friendly**: Proper meta tags and structured data

## 🤝 Contributing

1. Add your content using the CLI tool or manually
2. Follow the frontmatter schema for your content type
3. Test locally with `npm run dev`
4. Build and verify with `npm run build`

---

**Happy content creating! 🎉**
