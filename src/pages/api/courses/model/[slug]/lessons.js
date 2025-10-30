/**
 * Model-based Lesson API
 * GET /api/courses/model/[slug]/lessons - Get all lessons for a course
 * POST /api/courses/model/[slug]/lessons - Add lesson to course
 */

import CourseService from '../../../../../services/CourseService.js';

const courseService = new CourseService();

export default async function handler(req, res) {
  const { slug } = req.query;
  
  if (!slug) {
    return res.status(400).json({ message: 'Course slug is required' });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res, slug);
        break;
      case 'POST':
        await handlePost(req, res, slug);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Lesson API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleGet(req, res, slug) {
  try {
    const course = await courseService.getCourseBySlug(slug);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({
      lessons: course.lessons.map(lesson => lesson.toJSON()),
      total: course.lessons.length,
      courseTitle: course.title
    });
  } catch (error) {
    console.error('Error getting lessons:', error);
    res.status(500).json({ message: 'Failed to retrieve lessons' });
  }
}

async function handlePost(req, res, slug) {
  const lessonData = req.body;
  
  // Validate required fields
  if (!lessonData.title || !lessonData.content) {
    return res.status(400).json({ 
      message: 'Title and content are required' 
    });
  }
  
  try {
    // Get course to find its ID
    const course = await courseService.getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const updatedCourse = await courseService.addLesson(course.id, lessonData);
    
    res.status(201).json({
      message: 'Lesson added successfully',
      lesson: updatedCourse.lessons[updatedCourse.lessons.length - 1].toJSON(),
      totalLessons: updatedCourse.lessons.length
    });
  } catch (error) {
    console.error('Error adding lesson:', error);
    
    if (error.message.includes('validation failed') || 
        error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to add lesson' });
    }
  }
}
