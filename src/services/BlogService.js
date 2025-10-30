/**
 * Blog Service
 * Business logic layer for blog management
 */

import BlogRepository from '../models/BlogRepository.js';
import BlogPost from '../models/BlogPost.js';

class BlogService {
  constructor() {
    this.repository = new BlogRepository();
  }

  // Get all blog posts with optional filtering
  async getAllPosts(filters = {}) {
    try {
      const result = await this.repository.findAll(filters);
      
      // Process HTML content for each post
      for (const post of result.posts) {
        if (post.content) {
          post.contentHtml = await this.processMarkdown(post.content);
        }
      }
      
      return result;
    } catch (error) {
      console.error('BlogService: Error getting all posts:', error);
      throw new Error('Failed to retrieve blog posts');
    }
  }

  // Get blog post by slug
  async getPostBySlug(slug) {
    try {
      const post = await this.repository.findBySlug(slug);
      
      if (!post) {
        return null;
      }

      // Process HTML content
      if (post.content) {
        post.contentHtml = await this.processMarkdown(post.content);
      }
      
      return post;
    } catch (error) {
      console.error('BlogService: Error getting post by slug:', error);
      throw new Error('Failed to retrieve blog post');
    }
  }

  // Create new blog post
  async createPost(postData) {
    try {
      // Create post instance
      const post = new BlogPost(postData);
      
      // Generate slug if not provided
      if (!post.slug) {
        post.generateSlug();
      }
      
      // Generate excerpt if not provided
      if (!post.excerpt) {
        post.generateExcerpt();
      }
      
      // Calculate read time
      post.calculateReadTime();
      
      // Validate post
      const validation = post.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Check if post with same slug exists
      const existingPost = await this.repository.findBySlug(post.slug);
      if (existingPost) {
        throw new Error('Blog post with this slug already exists');
      }
      
      // Save post
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error creating post:', error);
      throw error;
    }
  }

  // Update existing blog post
  async updatePost(postId, postData) {
    try {
      // Get existing post
      const existingPost = await this.repository.findBySlug(postId);
      if (!existingPost) {
        throw new Error('Blog post not found');
      }
      
      // Update post data
      Object.assign(existingPost, postData);
      existingPost.updateTimestamp();
      
      // Regenerate excerpt if content changed
      if (postData.content && !postData.excerpt) {
        existingPost.generateExcerpt();
      }
      
      // Recalculate read time if content changed
      if (postData.content) {
        existingPost.calculateReadTime();
      }
      
      // Validate updated post
      const validation = existingPost.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Save updated post
      const savedPost = await this.repository.save(existingPost);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error updating post:', error);
      throw error;
    }
  }

  // Delete blog post
  async deletePost(postId) {
    try {
      const result = await this.repository.delete(postId);
      if (!result) {
        throw new Error('Blog post not found');
      }
      return result;
    } catch (error) {
      console.error('BlogService: Error deleting post:', error);
      throw error;
    }
  }

  // Publish blog post
  async publishPost(postId) {
    try {
      const post = await this.repository.findBySlug(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }
      
      post.publish();
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error publishing post:', error);
      throw error;
    }
  }

  // Unpublish blog post
  async unpublishPost(postId) {
    try {
      const post = await this.repository.findBySlug(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }
      
      post.unpublish();
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error unpublishing post:', error);
      throw error;
    }
  }

  // Archive blog post
  async archivePost(postId) {
    try {
      const post = await this.repository.findBySlug(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }
      
      post.archive();
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error archiving post:', error);
      throw error;
    }
  }

  // Get blog statistics
  async getStatistics() {
    try {
      return await this.repository.getStats();
    } catch (error) {
      console.error('BlogService: Error getting statistics:', error);
      throw error;
    }
  }

  // Search blog posts
  async searchPosts(query, options = {}) {
    try {
      const result = await this.repository.search(query, options);
      
      // Process HTML content for search results
      for (const post of result.results) {
        if (post.content) {
          post.contentHtml = await this.processMarkdown(post.content);
        }
      }
      
      return result;
    } catch (error) {
      console.error('BlogService: Error searching posts:', error);
      throw error;
    }
  }

  // Get posts by category
  async getPostsByCategory(category, options = {}) {
    try {
      return await this.repository.findByCategory(category, options);
    } catch (error) {
      console.error('BlogService: Error getting posts by category:', error);
      throw error;
    }
  }

  // Get posts by author
  async getPostsByAuthor(author, options = {}) {
    try {
      return await this.repository.findByAuthor(author, options);
    } catch (error) {
      console.error('BlogService: Error getting posts by author:', error);
      throw error;
    }
  }

  // Get posts by tag
  async getPostsByTag(tag, options = {}) {
    try {
      return await this.repository.findByTag(tag, options);
    } catch (error) {
      console.error('BlogService: Error getting posts by tag:', error);
      throw error;
    }
  }

  // Get featured posts
  async getFeaturedPosts(limit = 5) {
    try {
      const posts = await this.repository.getFeaturedPosts(limit);
      
      // Process HTML content
      for (const post of posts) {
        if (post.content) {
          post.contentHtml = await this.processMarkdown(post.content);
        }
      }
      
      return posts;
    } catch (error) {
      console.error('BlogService: Error getting featured posts:', error);
      throw error;
    }
  }

  // Get recent posts
  async getRecentPosts(limit = 10) {
    try {
      const posts = await this.repository.getRecentPosts(limit);
      
      // Process HTML content
      for (const post of posts) {
        if (post.content) {
          post.contentHtml = await this.processMarkdown(post.content);
        }
      }
      
      return posts;
    } catch (error) {
      console.error('BlogService: Error getting recent posts:', error);
      throw error;
    }
  }

  // Get popular posts
  async getPopularPosts(limit = 10) {
    try {
      return await this.repository.getPopularPosts(limit);
    } catch (error) {
      console.error('BlogService: Error getting popular posts:', error);
      throw error;
    }
  }

  // Get related posts
  async getRelatedPosts(postSlug, limit = 5) {
    try {
      const post = await this.repository.findBySlug(postSlug);
      if (!post) {
        throw new Error('Blog post not found');
      }
      
      return await this.repository.getRelatedPosts(post, limit);
    } catch (error) {
      console.error('BlogService: Error getting related posts:', error);
      throw error;
    }
  }

  // Increment post views
  async incrementViews(postSlug) {
    try {
      return await this.repository.incrementViews(postSlug);
    } catch (error) {
      console.error('BlogService: Error incrementing views:', error);
      return false;
    }
  }

  // Increment post likes
  async incrementLikes(postSlug) {
    try {
      return await this.repository.incrementLikes(postSlug);
    } catch (error) {
      console.error('BlogService: Error incrementing likes:', error);
      return false;
    }
  }

  // Get categories
  async getCategories() {
    try {
      return await this.repository.getCategories();
    } catch (error) {
      console.error('BlogService: Error getting categories:', error);
      throw error;
    }
  }

  // Get tags
  async getTags() {
    try {
      return await this.repository.getTags();
    } catch (error) {
      console.error('BlogService: Error getting tags:', error);
      throw error;
    }
  }

  // Get authors
  async getAuthors() {
    try {
      return await this.repository.getAuthors();
    } catch (error) {
      console.error('BlogService: Error getting authors:', error);
      throw error;
    }
  }

  // Generate blog post from template
  async generatePostFromTemplate(templateData) {
    try {
      const post = new BlogPost(templateData);
      post.generateSlug();
      post.generateExcerpt();
      post.calculateReadTime();
      
      // Generate content from template if content is empty
      if (!post.content) {
        post.content = BlogPost.generateTemplate(post);
      }
      
      // Validate and save
      const validation = post.validate();
      if (!validation.isValid) {
        throw new Error(`Post validation failed: ${validation.errors.join(', ')}`);
      }
      
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error generating post from template:', error);
      throw error;
    }
  }

  // Export blog post to different formats
  async exportPost(postId, format = 'json') {
    try {
      const post = await this.repository.findBySlug(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }
      
      switch (format) {
        case 'json':
          return JSON.stringify(post.toJSON(), null, 2);
          
        case 'markdown':
          return this.exportToMarkdown(post);
          
        case 'html':
          return await this.exportToHTML(post);
          
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('BlogService: Error exporting post:', error);
      throw error;
    }
  }

  // Import blog post from different formats
  async importPost(data, format = 'json') {
    try {
      let postData;
      
      switch (format) {
        case 'json':
          postData = JSON.parse(data);
          break;
          
        case 'markdown':
          postData = this.parseMarkdownImport(data);
          break;
          
        default:
          throw new Error('Unsupported import format');
      }
      
      const post = new BlogPost(postData);
      const savedPost = await this.repository.save(post);
      
      return savedPost;
    } catch (error) {
      console.error('BlogService: Error importing post:', error);
      throw error;
    }
  }

  // Process markdown content to HTML
  async processMarkdown(content) {
    try {
      // Simple markdown to HTML conversion
      let html = content
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Code blocks
        .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Line breaks
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');
      
      // Wrap in paragraphs
      html = '<p>' + html + '</p>';
      
      // Clean up empty paragraphs
      html = html.replace(/<p><\/p>/gim, '');
      html = html.replace(/<p><h([1-6])>/gim, '<h$1>');
      html = html.replace(/<\/h([1-6])><\/p>/gim, '</h$1>');
      html = html.replace(/<p><pre>/gim, '<pre>');
      html = html.replace(/<\/pre><\/p>/gim, '</pre>');
      
      return html;
    } catch (error) {
      console.error('BlogService: Error processing markdown:', error);
      return content; // Return original content if processing fails
    }
  }

  // Export post to markdown format
  exportToMarkdown(post) {
    const frontmatter = post.toMarkdownFrontmatter();
    
    // Simple frontmatter generation
    let markdown = '---\n';
    Object.entries(frontmatter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        markdown += `${key}:\n`;
        value.forEach(item => {
          markdown += `  - "${item}"\n`;
        });
      } else {
        markdown += `${key}: "${value}"\n`;
      }
    });
    markdown += '---\n\n';
    markdown += post.content;
    
    return markdown;
  }

  // Export post to HTML format
  async exportToHTML(post) {
    const html = await this.processMarkdown(post.content);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.seoTitle || post.title}</title>
    <meta name="description" content="${post.seoDescription || post.excerpt}">
    <meta name="author" content="${post.author}">
    <meta name="keywords" content="${post.tags.join(', ')}">
</head>
<body>
    <article>
        <header>
            <h1>${post.title}</h1>
            <p class="excerpt">${post.excerpt}</p>
            <div class="meta">
                <span>By ${post.author}</span>
                <span>Published on ${new Date(post.publishedAt).toLocaleDateString()}</span>
                <span>Category: ${post.category}</span>
                <span>Read time: ${post.readTime} minutes</span>
            </div>
            <div class="tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </header>
        <main>
            ${html}
        </main>
    </article>
</body>
</html>`;
  }

  // Parse markdown import
  parseMarkdownImport(data) {
    // Simple frontmatter parsing
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = data.match(frontmatterRegex);
    
    if (match) {
      const frontmatterText = match[1];
      const content = match[2];
      
      // Parse frontmatter
      const frontmatter = {};
      frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim().replace(/^[\"']|[\"']$/g, '');
          frontmatter[key.trim()] = value === 'true' ? true : value === 'false' ? false : value;
        }
      });
      
      return {
        ...frontmatter,
        content: content.trim()
      };
    }
    
    return {
      content: data
    };
  }

  // Backup blog post
  async backupPost(postId, backupPath) {
    try {
      return await this.repository.backup(postId, backupPath);
    } catch (error) {
      console.error('BlogService: Error backing up post:', error);
      throw error;
    }
  }

  // Restore blog post
  async restorePost(backupPath, postId) {
    try {
      return await this.repository.restore(backupPath, postId);
    } catch (error) {
      console.error('BlogService: Error restoring post:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateStatus(postIds, status) {
    try {
      const results = [];
      
      for (const postId of postIds) {
        try {
          const post = await this.repository.findBySlug(postId);
          if (post) {
            post.status = status;
            if (status === 'published' && !post.publishedAt) {
              post.publishedAt = new Date().toISOString();
            }
            post.updateTimestamp();
            
            const savedPost = await this.repository.save(post);
            results.push({ postId, success: true, post: savedPost });
          } else {
            results.push({ postId, success: false, error: 'Post not found' });
          }
        } catch (error) {
          results.push({ postId, success: false, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      console.error('BlogService: Error in bulk update:', error);
      throw error;
    }
  }

  // Get blog analytics
  async getAnalytics(timeframe = '30d') {
    try {
      const stats = await this.getStatistics();
      const { posts } = await this.getAllPosts({ status: 'published' });
      
      // Calculate timeframe
      const now = new Date();
      const timeframeMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      };
      
      const cutoffDate = new Date(now.getTime() - timeframeMs[timeframe]);
      
      const recentPosts = posts.filter(post => 
        new Date(post.publishedAt) >= cutoffDate
      );
      
      return {
        timeframe,
        totalPosts: posts.length,
        recentPosts: recentPosts.length,
        totalViews: posts.reduce((sum, p) => sum + p.views, 0),
        totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
        averageViews: posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + p.views, 0) / posts.length) : 0,
        averageLikes: posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + p.likes, 0) / posts.length) : 0,
        topPosts: posts
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
          .map(p => ({ title: p.title, slug: p.slug, views: p.views, likes: p.likes })),
        categoryDistribution: stats.postsByCategory,
        tagDistribution: stats.popularTags
      };
    } catch (error) {
      console.error('BlogService: Error getting analytics:', error);
      throw error;
    }
  }
}

export default BlogService;
