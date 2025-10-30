/**
 * Blog Post Actions API
 * POST /api/blog/actions/[slug] - Perform actions on blog posts
 * Actions: publish, unpublish, archive, like, unlike
 */

import BlogService from '../../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { slug } = req.query;
  const { action } = req.body;
  
  if (!slug) {
    return res.status(400).json({ message: 'Blog post slug is required' });
  }
  
  if (!action) {
    return res.status(400).json({ message: 'Action is required' });
  }
  
  try {
    let result;
    let message;
    
    switch (action) {
      case 'publish':
        result = await blogService.publishPost(slug);
        message = 'Blog post published successfully';
        break;
        
      case 'unpublish':
        result = await blogService.unpublishPost(slug);
        message = 'Blog post unpublished successfully';
        break;
        
      case 'archive':
        result = await blogService.archivePost(slug);
        message = 'Blog post archived successfully';
        break;
        
      case 'like':
        const liked = await blogService.incrementLikes(slug);
        if (!liked) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        const likedPost = await blogService.getPostBySlug(slug);
        result = likedPost;
        message = 'Blog post liked successfully';
        break;
        
      case 'view':
        const viewed = await blogService.incrementViews(slug);
        if (!viewed) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        const viewedPost = await blogService.getPostBySlug(slug);
        result = viewedPost;
        message = 'Blog post view recorded';
        break;
        
      default:
        return res.status(400).json({ 
          message: 'Invalid action. Supported actions: publish, unpublish, archive, like, view' 
        });
    }
    
    res.status(200).json({
      message,
      post: result.toJSON(),
      action
    });
    
  } catch (error) {
    console.error(`Error performing action ${action} on blog post:`, error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ 
        message: `Failed to ${action} blog post`,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
