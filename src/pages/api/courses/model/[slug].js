/**
 * Model-based Course API by Slug
 * GET /api/courses/model/[slug] - Get course by slug
 * PUT /api/courses/model/[slug] - Update course
 * DELETE /api/courses/model/[slug] - Delete course
 */

import CourseService from '../../../../services/CourseService.js';

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
    console.error('Course API error:', error);
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
      course: course.toJSON()
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ message: 'Failed to retrieve course' });
  }
}

async function handlePut(req, res, slug) {
  const updateData = req.body;
  
  try {
    // First get the course to find its ID
    const existingCourse = await courseService.getCourseBySlug(slug);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const updatedCourse = await courseService.updateCourse(existingCourse.id, updateData);
    
    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse.toJSON()
    });
  } catch (error) {
    console.error('Error updating course:', error);
    
    if (error.message.includes('validation failed') || 
        error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update course' });
    }
  }
}

async function handleDelete(req, res, slug) {
  try {
    // First get the course to find its ID
    const existingCourse = await courseService.getCourseBySlug(slug);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await courseService.deleteCourse(existingCourse.id);
    
    res.status(200).json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete course' });
    }
  }
}
