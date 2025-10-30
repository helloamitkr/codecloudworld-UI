/**
 * Blog Statistics API
 * GET /api/blog/stats - Get blog statistics and analytics
 */

import BlogService from '../../../services/BlogService.js';

const blogService = new BlogService();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { timeframe = '30d' } = req.query;
  
  try {
    // Get basic statistics
    const stats = await blogService.getStatistics();
    
    // Get analytics data
    const analytics = await blogService.getAnalytics(timeframe);
    
    // Get categories, tags, and authors
    const [categories, tags, authors] = await Promise.all([
      blogService.getCategories(),
      blogService.getTags(),
      blogService.getAuthors()
    ]);
    
    if (!stats) {
      return res.status(500).json({ message: 'Failed to retrieve statistics' });
    }
    
    res.status(200).json({
      stats,
      analytics,
      categories,
      tags,
      authors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting blog statistics:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
