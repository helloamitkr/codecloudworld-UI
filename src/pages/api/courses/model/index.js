/**
 * Model-based Course API
 * GET /api/courses/model - Get all courses
 * POST /api/courses/model - Create new course
 */

import CourseService from '../../../../services/CourseService.js';

const courseService = new CourseService();

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
    console.error('Course API error:', error);
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
    tag, 
    search, 
    limit = 10, 
    offset = 0 
  } = req.query;

  try {
    let courses;
    
    if (search) {
      // Search courses
      const searchResult = await courseService.searchCourses(search, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.status(200).json({
        courses: searchResult.results,
        total: searchResult.total,
        hasMore: searchResult.hasMore,
        search: search
      });
    } else {
      // Get all courses with filters
      const filters = {};
      if (status) filters.status = status;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (tag) filters.tag = tag;
      
      courses = await courseService.getAllCourses(filters);
      
      // Apply pagination
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      const paginatedCourses = courses.slice(startIndex, endIndex);
      
      res.status(200).json({
        courses: paginatedCourses,
        total: courses.length,
        hasMore: courses.length > endIndex,
        filters: filters
      });
    }
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Failed to retrieve courses' });
  }
}

async function handlePost(req, res) {
  const courseData = req.body;
  
  // Validate required fields
  if (!courseData.title || !courseData.description) {
    return res.status(400).json({ 
      message: 'Title and description are required' 
    });
  }
  
  try {
    const course = await courseService.createCourse(courseData);
    
    res.status(201).json({
      message: 'Course created successfully',
      course: course.toJSON()
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.message.includes('validation failed') || 
        error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create course' });
    }
  }
}
