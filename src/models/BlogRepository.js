/**
 * Blog Repository
 * Handles data persistence and retrieval for blog posts
 */

import fs from 'fs';
import path from 'path';
import BlogPost from './BlogPost.js';

class BlogRepository {
  constructor(basePath = 'content/blog') {
    this.basePath = path.join(process.cwd(), basePath);
    this.ensureDirectoryExists();
  }

  // Ensure base directory exists
  ensureDirectoryExists() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  // Get all blog posts
  async findAll(options = {}) {
    const { 
      status = null, 
      featured = null, 
      category = null, 
      author = null,
      tag = null,
      limit = null,
      offset = 0,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = options;
    
    try {
      const postFiles = fs.readdirSync(this.basePath)
        .filter(file => file.endsWith('.md'));

      const posts = [];

      for (const postFile of postFiles) {
        const post = await this.findByFile(postFile);
        if (post) {
          // Apply filters
          if (status && post.status !== status) continue;
          if (featured !== null && post.featured !== featured) continue;
          if (category && post.category !== category) continue;
          if (author && post.author !== author) continue;
          if (tag && !post.tags.includes(tag)) continue;
          
          posts.push(post);
        }
      }

      // Sort posts
      posts.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle date sorting
        if (sortBy === 'publishedAt' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const startIndex = offset;
      const endIndex = limit ? startIndex + limit : posts.length;
      
      return {
        posts: posts.slice(startIndex, endIndex),
        total: posts.length,
        hasMore: limit ? posts.length > endIndex : false
      };
    } catch (error) {
      console.error('Error finding blog posts:', error);
      return { posts: [], total: 0, hasMore: false };
    }
  }

  // Find blog post by slug
  async findBySlug(slug) {
    try {
      const postFiles = fs.readdirSync(this.basePath)
        .filter(file => file.endsWith('.md'));

      for (const postFile of postFiles) {
        const post = await this.findByFile(postFile);
        if (post && post.slug === slug) {
          return post;
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding blog post by slug:', error);
      return null;
    }
  }

  // Find blog post by file name
  async findByFile(fileName) {
    try {
      const filePath = path.join(this.basePath, fileName);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: postData, content: postContent } = this.parseFrontmatter(fileContent);

      const post = BlogPost.fromMarkdown(postData, postContent);
      post.id = fileName.replace('.md', '');
      post.fileName = fileName;

      return post;
    } catch (error) {
      console.error('Error finding blog post by file:', error);
      return null;
    }
  }

  // Save blog post
  async save(post) {
    if (!(post instanceof BlogPost)) {
      throw new Error('Post must be an instance of BlogPost class');
    }

    // Validate post
    const validation = post.validate();
    if (!validation.isValid) {
      throw new Error(`Blog post validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      // Generate ID if not exists
      if (!post.id) {
        post.id = post.slug || post.generateSlug();
      }

      // Update timestamp
      post.updateTimestamp();

      // Generate file name
      const fileName = `${post.id}.md`;
      const filePath = path.join(this.basePath, fileName);

      // Generate content
      const frontmatter = post.toMarkdownFrontmatter();
      const content = this.stringifyFrontmatter(post.content || '', frontmatter);

      fs.writeFileSync(filePath, content, 'utf8');
      post.fileName = fileName;

      return post;
    } catch (error) {
      console.error('Error saving blog post:', error);
      throw error;
    }
  }

  // Delete blog post
  async delete(postId) {
    try {
      const fileName = `${postId}.md`;
      const filePath = path.join(this.basePath, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  // Get blog statistics
  async getStats() {
    try {
      const { posts } = await this.findAll();
      
      const stats = {
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        draftPosts: posts.filter(p => p.status === 'draft').length,
        archivedPosts: posts.filter(p => p.status === 'archived').length,
        featuredPosts: posts.filter(p => p.featured).length,
        totalViews: posts.reduce((sum, p) => sum + p.views, 0),
        totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
        averageReadTime: posts.length > 0 
          ? Math.round(posts.reduce((sum, p) => sum + p.readTime, 0) / posts.length)
          : 0,
        postsByCategory: {},
        postsByAuthor: {},
        popularTags: {},
        recentPosts: posts
          .filter(p => p.status === 'published')
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 5)
          .map(p => ({ id: p.id, title: p.title, slug: p.slug, publishedAt: p.publishedAt }))
      };

      // Count posts by category
      posts.forEach(post => {
        stats.postsByCategory[post.category] = (stats.postsByCategory[post.category] || 0) + 1;
      });

      // Count posts by author
      posts.forEach(post => {
        stats.postsByAuthor[post.author] = (stats.postsByAuthor[post.author] || 0) + 1;
      });

      // Count popular tags
      posts.forEach(post => {
        post.tags.forEach(tag => {
          stats.popularTags[tag] = (stats.popularTags[tag] || 0) + 1;
        });
      });

      // Sort popular tags
      stats.popularTags = Object.entries(stats.popularTags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .reduce((obj, [tag, count]) => {
          obj[tag] = count;
          return obj;
        }, {});

      return stats;
    } catch (error) {
      console.error('Error getting blog stats:', error);
      return null;
    }
  }

  // Search blog posts
  async search(query, options = {}) {
    const { limit = 10, offset = 0, category = null, author = null } = options;
    
    try {
      const { posts: allPosts } = await this.findAll({ category, author });
      const searchTerm = query.toLowerCase();

      const results = allPosts.filter(post => {
        return post.title.toLowerCase().includes(searchTerm) ||
               post.excerpt.toLowerCase().includes(searchTerm) ||
               post.content.toLowerCase().includes(searchTerm) ||
               post.author.toLowerCase().includes(searchTerm) ||
               post.category.toLowerCase().includes(searchTerm) ||
               post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      });

      return {
        results: results.slice(offset, offset + limit),
        total: results.length,
        hasMore: results.length > offset + limit
      };
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return { results: [], total: 0, hasMore: false };
    }
  }

  // Get posts by category
  async findByCategory(category, options = {}) {
    return this.findAll({ ...options, category });
  }

  // Get posts by author
  async findByAuthor(author, options = {}) {
    return this.findAll({ ...options, author });
  }

  // Get posts by tag
  async findByTag(tag, options = {}) {
    return this.findAll({ ...options, tag });
  }

  // Get featured posts
  async getFeaturedPosts(limit = 5) {
    const { posts } = await this.findAll({ 
      featured: true, 
      status: 'published',
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    });
    
    return posts;
  }

  // Get recent posts
  async getRecentPosts(limit = 10) {
    const { posts } = await this.findAll({ 
      status: 'published',
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    });
    
    return posts;
  }

  // Get popular posts (by views)
  async getPopularPosts(limit = 10) {
    const { posts } = await this.findAll({ 
      status: 'published',
      limit,
      sortBy: 'views',
      sortOrder: 'desc'
    });
    
    return posts;
  }

  // Get related posts
  async getRelatedPosts(post, limit = 5) {
    try {
      const { posts: allPosts } = await this.findAll({ status: 'published' });
      
      // Score posts based on similarity
      const scoredPosts = allPosts
        .filter(p => p.id !== post.id)
        .map(p => {
          let score = 0;
          
          // Same category gets high score
          if (p.category === post.category) score += 10;
          
          // Shared tags get medium score
          const sharedTags = p.tags.filter(tag => post.tags.includes(tag));
          score += sharedTags.length * 5;
          
          // Same author gets low score
          if (p.author === post.author) score += 2;
          
          return { post: p, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.post);

      return scoredPosts;
    } catch (error) {
      console.error('Error getting related posts:', error);
      return [];
    }
  }

  // Backup blog post
  async backup(postId, backupPath) {
    try {
      const post = await this.findBySlug(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }

      const fileName = `${postId}.md`;
      const sourcePath = path.join(this.basePath, fileName);
      const targetPath = path.join(backupPath, `${postId}_backup_${Date.now()}.md`);

      fs.copyFileSync(sourcePath, targetPath);

      return targetPath;
    } catch (error) {
      console.error('Error backing up blog post:', error);
      throw error;
    }
  }

  // Restore blog post from backup
  async restore(backupPath, postId) {
    try {
      const fileName = `${postId}.md`;
      const targetPath = path.join(this.basePath, fileName);
      
      fs.copyFileSync(backupPath, targetPath);

      return await this.findBySlug(postId);
    } catch (error) {
      console.error('Error restoring blog post:', error);
      throw error;
    }
  }

  // Increment post views
  async incrementViews(postId) {
    try {
      const post = await this.findBySlug(postId);
      if (!post) return false;

      post.incrementViews();
      await this.save(post);
      
      return true;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return false;
    }
  }

  // Increment post likes
  async incrementLikes(postId) {
    try {
      const post = await this.findBySlug(postId);
      if (!post) return false;

      post.incrementLikes();
      await this.save(post);
      
      return true;
    } catch (error) {
      console.error('Error incrementing likes:', error);
      return false;
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const { posts } = await this.findAll();
      const categories = [...new Set(posts.map(post => post.category))];
      
      return categories.map(category => ({
        name: category,
        count: posts.filter(post => post.category === category).length
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Get all tags
  async getTags() {
    try {
      const { posts } = await this.findAll();
      const tagCounts = {};
      
      posts.forEach(post => {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      return Object.entries(tagCounts)
        .map(([tag, count]) => ({ name: tag, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  // Get all authors
  async getAuthors() {
    try {
      const { posts } = await this.findAll();
      const authorCounts = {};
      
      posts.forEach(post => {
        authorCounts[post.author] = (authorCounts[post.author] || 0) + 1;
      });
      
      return Object.entries(authorCounts)
        .map(([author, count]) => ({ name: author, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting authors:', error);
      return [];
    }
  }

  // Parse frontmatter from markdown content
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const frontmatterText = match[1];
      const markdownContent = match[2];
      
      // Parse frontmatter
      const data = {};
      const lines = frontmatterText.split('\n');
      let currentKey = null;
      let currentArray = [];
      let inArray = false;
      let inMultiline = false;
      let multilineValue = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle array items
        if (line.trim().startsWith('- ')) {
          if (inArray && currentKey) {
            const item = line.trim().substring(2).trim();
            currentArray.push(item);
          }
          continue;
        }
        
        // Handle multiline continuation
        if (inMultiline) {
          if (line.trim() === '' || line.startsWith('  ')) {
            multilineValue += (multilineValue ? '\n' : '') + line.trim();
            continue;
          } else {
            // End of multiline, save it
            if (currentKey) {
              data[currentKey] = multilineValue;
            }
            inMultiline = false;
            multilineValue = '';
          }
        }
        
        // Save previous array if we're starting a new key
        if (inArray && currentKey && !line.trim().startsWith('- ')) {
          data[currentKey] = currentArray;
          inArray = false;
          currentArray = [];
        }
        
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentKey = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // Handle different value types
          if (value === '') {
            // This might be an array or multiline string
            inArray = true;
            currentArray = [];
          } else if (value.startsWith('"') && value.endsWith('"')) {
            data[currentKey] = value.slice(1, -1); // Remove quotes
          } else if (value.startsWith("'") && value.endsWith("'")) {
            data[currentKey] = value.slice(1, -1); // Remove quotes
          } else if (value === 'true') {
            data[currentKey] = true;
          } else if (value === 'false') {
            data[currentKey] = false;
          } else if (!isNaN(value) && value !== '') {
            data[currentKey] = Number(value);
          } else if (value.startsWith('>-')) {
            // Handle multiline strings
            inMultiline = true;
            multilineValue = value.substring(2).trim();
          } else {
            data[currentKey] = value;
          }
        }
      }
      
      // Handle final array or multiline
      if (inArray && currentKey) {
        data[currentKey] = currentArray;
      }
      if (inMultiline && currentKey) {
        data[currentKey] = multilineValue;
      }
      
      // Set default values for missing fields
      if (!data.tags) data.tags = [];
      if (!data.featuredImage) data.featuredImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      if (!data.featuredImageAlt) data.featuredImageAlt = data.title || 'Blog post image';
      
      return {
        data,
        content: markdownContent.trim()
      };
    }
    
    return {
      data: {
        tags: [],
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Blog post image'
      },
      content: content
    };
  }

  // Stringify frontmatter and content
  stringifyFrontmatter(content, frontmatter) {
    let markdown = '---\n';
    
    Object.entries(frontmatter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        markdown += `${key}:\n`;
        value.forEach(item => {
          markdown += `  - ${item}\n`;
        });
      } else if (typeof value === 'string' && (value.includes('\n') || value.length > 50)) {
        // Handle multiline strings
        markdown += `${key}: >-\n`;
        const lines = value.split('\n');
        lines.forEach(line => {
          markdown += `  ${line}\n`;
        });
      } else {
        markdown += `${key}: ${typeof value === 'string' ? `'${value}'` : value}\n`;
      }
    });
    
    markdown += '---\n\n';
    markdown += content;
    
    return markdown;
  }
}

export default BlogRepository;
