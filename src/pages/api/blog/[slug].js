/**
 * Blog Post API by Slug
 * GET /api/blog/[slug] - Get blog post by slug
 * PUT /api/blog/[slug] - Update blog post
 * DELETE /api/blog/[slug] - Delete blog post
 */

import BlogService from '../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  const { slug } = req.query;
  
  if (!slug) {
    return res.status(400).json({ message: 'Blog post slug is required' });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res, slug);
        break;
      case 'PUT':
        await handlePut(req, res, slug);
        break;
      case 'DELETE':
        await handleDelete(req, res, slug);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Blog Post API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleGet(req, res, slug) {
  const { incrementViews } = req.query;
  
  try {
    const post = await blogService.getPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment views if requested (for public viewing)
    if (incrementViews === 'true') {
      await blogService.incrementViews(slug);
      post.views += 1; // Update the current instance
    }
    
    // Get related posts
    const relatedPosts = await blogService.getRelatedPosts(slug, 5);
    
    res.status(200).json({
      post: post.toJSON(),
      relatedPosts: relatedPosts.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        author: p.author,
        publishedAt: p.publishedAt,
        readTime: p.readTime
      }))
    });
  } catch (error) {
    console.error('Error getting blog post:', error);
    res.status(500).json({ message: 'Failed to retrieve blog post' });
  }
}

async function handlePut(req, res, slug) {
  const updateData = req.body;
  
  try {
    const updatedPost = await blogService.updatePost(slug, updateData);
    
    res.status(200).json({
      message: 'Blog post updated successfully',
      post: updatedPost.toJSON()
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    if (error.message.includes('validation failed') || 
        error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  }
}

async function handleDelete(req, res, slug) {
  try {
    await blogService.deletePost(slug);
    
    res.status(200).json({
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  }
}
