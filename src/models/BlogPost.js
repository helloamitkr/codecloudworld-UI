/**
 * BlogPost Model
 * Defines the structure and validation for blog post data
 */

class BlogPost {
  constructor(data = {}) {
    this.id = data.id || null;
    this.slug = data.slug || '';
    this.title = data.title || '';
    this.excerpt = data.excerpt || '';
    this.content = data.content || '';
    this.contentHtml = data.contentHtml || '';
    this.author = data.author || '';
    this.authorEmail = data.authorEmail || '';
    this.category = data.category || 'General';
    this.tags = data.tags || [];
    this.featuredImage = data.featuredImage || '';
    this.featuredImageAlt = data.featuredImageAlt || '';
    this.status = data.status || 'draft'; // draft, published, archived
    this.featured = data.featured || false;
    this.publishedAt = data.publishedAt || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.readTime = data.readTime || 0; // in minutes
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.seoTitle = data.seoTitle || '';
    this.seoDescription = data.seoDescription || '';
    this.metadata = data.metadata || {};
  }

  // Validation rules
  static validationRules = {
    title: {
      required: true,
      minLength: 5,
      maxLength: 200
    },
    excerpt: {
      required: true,
      minLength: 20,
      maxLength: 300
    },
    content: {
      required: true,
      minLength: 100
    },
    author: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    authorEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    category: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    slug: {
      required: true,
      pattern: /^[a-z0-9-]+$/,
      minLength: 3,
      maxLength: 200
    },
    seoTitle: {
      maxLength: 60
    },
    seoDescription: {
      maxLength: 160
    }
  };

  // Available categories
  static categories = [
    'Technology',
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI & Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Tutorial',
    'News',
    'General'
  ];

  // Available statuses
  static statuses = ['draft', 'published', 'archived', 'scheduled'];

  // Validate blog post data
  validate() {
    const errors = [];
    const rules = BlogPost.validationRules;

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = this[field];

      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        return;
      }

      if (value) {
        // Check string length
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${field} must not exceed ${rule.maxLength} characters`);
        }

        // Check patterns
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    });

    // Custom validations
    if (this.category && !BlogPost.categories.includes(this.category)) {
      errors.push(`Category must be one of: ${BlogPost.categories.join(', ')}`);
    }

    if (this.status && !BlogPost.statuses.includes(this.status)) {
      errors.push(`Status must be one of: ${BlogPost.statuses.join(', ')}`);
    }

    if (this.tags && !Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate slug from title
  generateSlug() {
    if (!this.title) return '';
    
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    return this.slug;
  }

  // Calculate estimated read time
  calculateReadTime() {
    if (!this.content) return 0;
    
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
    
    return this.readTime;
  }

  // Generate excerpt from content if not provided
  generateExcerpt(length = 150) {
    if (this.excerpt) return this.excerpt;
    
    if (!this.content) return '';
    
    // Remove markdown formatting and HTML tags
    const plainText = this.content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
    
    this.excerpt = plainText.length > length 
      ? plainText.substring(0, length) + '...'
      : plainText;
    
    return this.excerpt;
  }

  // Add tag
  addTag(tag) {
    if (typeof tag === 'string' && tag.trim()) {
      const normalizedTag = tag.trim().toLowerCase();
      if (!this.tags.includes(normalizedTag)) {
        this.tags.push(normalizedTag);
        this.updateTimestamp();
      }
    }
  }

  // Remove tag
  removeTag(tag) {
    const normalizedTag = tag.toLowerCase();
    this.tags = this.tags.filter(t => t !== normalizedTag);
    this.updateTimestamp();
  }

  // Publish post
  publish() {
    this.status = 'published';
    this.publishedAt = new Date().toISOString();
    this.updateTimestamp();
  }

  // Unpublish post
  unpublish() {
    this.status = 'draft';
    this.publishedAt = null;
    this.updateTimestamp();
  }

  // Archive post
  archive() {
    this.status = 'archived';
    this.updateTimestamp();
  }

  // Increment views
  incrementViews() {
    this.views += 1;
  }

  // Increment likes
  incrementLikes() {
    this.likes += 1;
  }

  // Update timestamp
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  // Get post statistics
  getStats() {
    return {
      wordCount: this.content.split(/\s+/).length,
      readTime: this.readTime,
      views: this.views,
      likes: this.likes,
      tags: this.tags.length,
      status: this.status,
      published: this.status === 'published',
      lastUpdated: this.updatedAt
    };
  }

  // Check if post is published
  isPublished() {
    return this.status === 'published' && this.publishedAt;
  }

  // Check if post is scheduled
  isScheduled() {
    return this.status === 'scheduled' && this.publishedAt && new Date(this.publishedAt) > new Date();
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      excerpt: this.excerpt,
      content: this.content,
      contentHtml: this.contentHtml,
      author: this.author,
      authorEmail: this.authorEmail,
      category: this.category,
      tags: this.tags,
      featuredImage: this.featuredImage,
      featuredImageAlt: this.featuredImageAlt,
      status: this.status,
      featured: this.featured,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      readTime: this.readTime,
      views: this.views,
      likes: this.likes,
      seoTitle: this.seoTitle,
      seoDescription: this.seoDescription,
      metadata: this.metadata,
      stats: this.getStats()
    };
  }

  // Create from markdown frontmatter
  static fromMarkdown(frontmatter, content) {
    const post = new BlogPost({
      ...frontmatter,
      content: content,
      contentHtml: content // Will be processed later
    });
    
    if (!post.slug && post.title) {
      post.generateSlug();
    }
    
    if (!post.excerpt) {
      post.generateExcerpt();
    }
    
    post.calculateReadTime();
    
    return post;
  }

  // Generate markdown frontmatter
  toMarkdownFrontmatter() {
    return {
      slug: this.slug,
      title: this.title,
      excerpt: this.excerpt,
      author: this.author,
      authorEmail: this.authorEmail,
      category: this.category,
      tags: this.tags,
      featuredImage: this.featuredImage,
      featuredImageAlt: this.featuredImageAlt,
      status: this.status,
      featured: this.featured,
      publishedAt: this.publishedAt,
      readTime: this.readTime,
      views: this.views,
      likes: this.likes,
      seoTitle: this.seoTitle,
      seoDescription: this.seoDescription,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Generate blog post template
  static generateTemplate(data = {}) {
    const post = new BlogPost(data);
    
    return `---
slug: "${post.slug}"
title: "${post.title}"
excerpt: "${post.excerpt}"
author: "${post.author}"
authorEmail: "${post.authorEmail}"
category: "${post.category}"
tags:
${post.tags.map(tag => `  - "${tag}"`).join('\n') || '  - "example-tag"'}
featuredImage: "${post.featuredImage}"
featuredImageAlt: "${post.featuredImageAlt}"
status: "${post.status}"
featured: ${post.featured}
seoTitle: "${post.seoTitle}"
seoDescription: "${post.seoDescription}"
publishedAt: ${post.publishedAt ? `"${post.publishedAt}"` : 'null'}
---

# ${post.title}

${post.excerpt}

## Introduction

Write your blog post introduction here. This should hook the reader and give them a preview of what they'll learn.

## Main Content

### Section 1: Key Concepts

Explain your main points here with examples:

\`\`\`javascript
// Code example
function example() {
  return "Hello World";
}
\`\`\`

### Section 2: Practical Examples

Show practical applications and real-world examples.

### Section 3: Best Practices

Share tips and best practices related to your topic.

## Conclusion

Summarize the key takeaways and provide next steps for readers.

## Resources

- [Resource 1](https://example.com) - Description
- [Resource 2](https://example.com) - Description

---

**Tags**: ${post.tags.join(', ')}  
**Category**: ${post.category}  
**Read Time**: ${post.readTime} minutes
`;
  }
}

export default BlogPost;
