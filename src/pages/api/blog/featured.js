/**
 * Featured Blog Posts API
 * GET /api/blog/featured - Get featured blog posts
 */

import BlogService from '../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { limit = 5 } = req.query;
  
  try {
    const featuredPosts = await blogService.getFeaturedPosts(parseInt(limit));
    
    res.status(200).json({
      posts: featuredPosts.map(post => ({
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
      total: featuredPosts.length
    });
  } catch (error) {
    console.error('Error getting featured blog posts:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve featured blog posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
