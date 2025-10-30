/**
 * Blog API
 * GET /api/blog - Get all blog posts
 * POST /api/blog - Create new blog post
 */

import BlogService from '../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleGet(req, res) {
  const { 
    status, 
    featured, 
    category, 
    author,
    tag,
    search, 
    limit = 10, 
    offset = 0,
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = req.query;

  try {
    let result;
    
    if (search) {
      // Search blog posts
      result = await blogService.searchPosts(search, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        category,
        author
      });
      
      res.status(200).json({
        posts: result.results,
        total: result.total,
        hasMore: result.hasMore,
        search: search
      });
    } else {
      // Get all blog posts with filters
      const filters = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        sortBy,
        sortOrder
      };
      
      if (status) filters.status = status;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (category) filters.category = category;
      if (author) filters.author = author;
      if (tag) filters.tag = tag;
      
      result = await blogService.getAllPosts(filters);
      
      res.status(200).json({
        posts: result.posts,
        total: result.total,
        hasMore: result.hasMore,
        filters: filters
      });
    }
  } catch (error) {
    console.error('Error getting blog posts:', error);
    res.status(500).json({ message: 'Failed to retrieve blog posts' });
  }
}

async function handlePost(req, res) {
  const postData = req.body;
  
  // Validate required fields
  if (!postData.title || !postData.content || !postData.author) {
    return res.status(400).json({ 
      message: 'Title, content, and author are required' 
    });
  }
  
  try {
    const post = await blogService.createPost(postData);
    
    res.status(201).json({
      message: 'Blog post created successfully',
      post: post.toJSON()
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error.message.includes('validation failed') || 
        error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  }
}
