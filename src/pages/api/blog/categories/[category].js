/**
 * Blog Posts by Category API
 * GET /api/blog/categories/[category] - Get blog posts by category
 */

import BlogService from '../../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { category } = req.query;
  const { 
    limit = 10, 
    offset = 0,
    status = 'published',
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = req.query;
  
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }
  
  try {
    const result = await blogService.getPostsByCategory(category, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      status,
      sortBy,
      sortOrder
    });
    
    res.status(200).json({
      category,
      posts: result.posts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category,
        tags: post.tags,
        featuredImage: post.featuredImage,
        featuredImageAlt: post.featuredImageAlt,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        views: post.views,
        likes: post.likes
      })),
      total: result.total,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error getting blog posts by category:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve blog posts by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
