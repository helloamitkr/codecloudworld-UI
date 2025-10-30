/**
 * Course Statistics API
 * GET /api/courses/model/stats - Get course statistics
 */

import CourseService from '../../../../services/CourseService.js';

const courseService = new CourseService();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const stats = await courseService.getStatistics();
    
    if (!stats) {
      return res.status(500).json({ message: 'Failed to retrieve statistics' });
    }
    
    res.status(200).json({
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting course statistics:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
