/**
 * Course Service
 * Business logic layer for course management
 */

import CourseRepository from '../models/CourseRepository.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// Simple markdown to HTML processor
function processMarkdownToHtml(content) {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');
}

class CourseService {
  constructor() {
    this.repository = new CourseRepository();
  }

  // Get all courses with optional filtering
  async getAllCourses(filters = {}) {
    try {
      const courses = await this.repository.findAll(filters);
      
      // Process HTML content for each course
      for (const course of courses) {
        if (course.contentHtml) {
          course.contentHtml = processMarkdownToHtml(course.contentHtml);
        }
        
        // Process lesson content
        for (const lesson of course.lessons) {
          if (lesson.content) {
            lesson.contentHtml = processMarkdownToHtml(lesson.content);
          }
        }
      }
      
      return courses;
    } catch (error) {
      console.error('CourseService: Error getting all courses:', error);
      throw new Error('Failed to retrieve courses');
    }
  }

  // Get course by slug
  async getCourseBySlug(slug) {
    try {
      const course = await this.repository.findBySlug(slug);
      
      if (!course) {
        return null;
      }

      // Process HTML content
      if (course.contentHtml) {
        course.contentHtml = processMarkdownToHtml(course.contentHtml);
      }
      
      // Process lesson content
      for (const lesson of course.lessons) {
        if (lesson.content) {
          lesson.contentHtml = processMarkdownToHtml(lesson.content);
        }
      }
      
      return course;
    } catch (error) {
      console.error('CourseService: Error getting course by slug:', error);
      throw new Error('Failed to retrieve course');
    }
  }

  // Create new course
  async createCourse(courseData) {
    try {
      // Create course instance
      const course = new Course(courseData);
      
      // Generate slug if not provided
      if (!course.slug) {
        course.generateSlug();
      }
      
      // Validate course
      const validation = course.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Check if course with same slug exists
      const existingCourse = await this.repository.findBySlug(course.slug);
      if (existingCourse) {
        throw new Error('Course with this slug already exists');
      }
      
      // Save course
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error creating course:', error);
      throw error;
    }
  }

  // Update existing course
  async updateCourse(courseId, courseData) {
    try {
      // Get existing course
      const existingCourse = await this.repository.findByDirectory(courseId);
      if (!existingCourse) {
        throw new Error('Course not found');
      }
      
      // Update course data
      Object.assign(existingCourse, courseData);
      existingCourse.updateTimestamp();
      
      // Validate updated course
      const validation = existingCourse.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Save updated course
      const savedCourse = await this.repository.save(existingCourse);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error updating course:', error);
      throw error;
    }
  }

  // Delete course
  async deleteCourse(courseId) {
    try {
      const result = await this.repository.delete(courseId);
      if (!result) {
        throw new Error('Course not found');
      }
      return result;
    } catch (error) {
      console.error('CourseService: Error deleting course:', error);
      throw error;
    }
  }

  // Add lesson to course
  async addLesson(courseId, lessonData) {
    try {
      // Get course
      const course = await this.repository.findByDirectory(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Create lesson instance
      const lesson = new Lesson(lessonData);
      lesson.courseId = courseId;
      
      // Generate slug if not provided
      if (!lesson.slug) {
        lesson.generateSlug();
      }
      
      // Set order if not provided
      if (!lesson.order) {
        lesson.order = course.lessons.length + 1;
      }
      
      // Validate lesson
      const validation = lesson.validate();
      if (!validation.isValid) {
        throw new Error(`Lesson validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Add lesson to course
      course.addLesson(lesson);
      
      // Save course with new lesson
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error adding lesson:', error);
      throw error;
    }
  }

  // Update lesson
  async updateLesson(courseId, lessonId, lessonData) {
    try {
      // Get course
      const course = await this.repository.findByDirectory(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Find lesson
      const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) {
        throw new Error('Lesson not found');
      }
      
      // Update lesson data
      Object.assign(course.lessons[lessonIndex], lessonData);
      course.lessons[lessonIndex].updateTimestamp();
      
      // Validate updated lesson
      const validation = course.lessons[lessonIndex].validate();
      if (!validation.isValid) {
        throw new Error(`Lesson validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Save course with updated lesson
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error updating lesson:', error);
      throw error;
    }
  }

  // Delete lesson
  async deleteLesson(courseId, lessonId) {
    try {
      // Get course
      const course = await this.repository.findByDirectory(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Remove lesson
      course.removeLesson(lessonId);
      
      // Save course without lesson
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error deleting lesson:', error);
      throw error;
    }
  }

  // Get course statistics
  async getStatistics() {
    try {
      return await this.repository.getStats();
    } catch (error) {
      console.error('CourseService: Error getting statistics:', error);
      throw error;
    }
  }

  // Search courses
  async searchCourses(query, options = {}) {
    try {
      return await this.repository.search(query, options);
    } catch (error) {
      console.error('CourseService: Error searching courses:', error);
      throw error;
    }
  }

  // Generate course from template
  async generateCourseFromTemplate(templateData) {
    try {
      const { courseData, lessonsData } = templateData;
      
      // Create course
      const course = new Course(courseData);
      course.generateSlug();
      
      // Create lessons
      const lessons = lessonsData.map((lessonData, index) => {
        const lesson = new Lesson(lessonData);
        lesson.order = index + 1;
        lesson.generateSlug();
        
        // Generate lesson content from template if content is empty
        if (!lesson.content) {
          lesson.content = Lesson.generateTemplate(lesson);
        }
        
        return lesson;
      });
      
      course.lessons = lessons;
      
      // Validate and save
      const validation = course.validate();
      if (!validation.isValid) {
        throw new Error(`Course validation failed: ${validation.errors.join(', ')}`);
      }
      
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error generating course from template:', error);
      throw error;
    }
  }

  // Export course to different formats
  async exportCourse(courseId, format = 'json') {
    try {
      const course = await this.repository.findByDirectory(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      switch (format) {
        case 'json':
          return JSON.stringify(course.toJSON(), null, 2);
          
        case 'markdown':
          return this.exportToMarkdown(course);
          
        case 'zip':
          return this.exportToZip(course);
          
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('CourseService: Error exporting course:', error);
      throw error;
    }
  }

  // Import course from different formats
  async importCourse(data, format = 'json') {
    try {
      let courseData;
      
      switch (format) {
        case 'json':
          courseData = JSON.parse(data);
          break;
          
        case 'markdown':
          courseData = this.parseMarkdownImport(data);
          break;
          
        default:
          throw new Error('Unsupported import format');
      }
      
      const course = new Course(courseData);
      const savedCourse = await this.repository.save(course);
      
      return savedCourse;
    } catch (error) {
      console.error('CourseService: Error importing course:', error);
      throw error;
    }
  }


  // Export course to markdown format
  exportToMarkdown(course) {
    let markdown = `# ${course.title}\n\n`;
    markdown += `${course.description}\n\n`;
    markdown += `**Level**: ${course.level}\n`;
    markdown += `**Duration**: ${course.duration}\n`;
    markdown += `**Tag**: ${course.tag}\n\n`;
    
    course.lessons.forEach((lesson, index) => {
      markdown += `## Lesson ${index + 1}: ${lesson.title}\n\n`;
      markdown += `**Duration**: ${lesson.duration}\n\n`;
      markdown += `${lesson.content}\n\n`;
      markdown += '---\n\n';
    });
    
    return markdown;
  }

  // Parse markdown import
  parseMarkdownImport(data) {
    // Implementation for parsing markdown import
    // This would parse a structured markdown file back into course data
    throw new Error('Markdown import not yet implemented');
  }

  // Backup course
  async backupCourse(courseId, backupPath) {
    try {
      return await this.repository.backup(courseId, backupPath);
    } catch (error) {
      console.error('CourseService: Error backing up course:', error);
      throw error;
    }
  }

  // Restore course
  async restoreCourse(backupPath, courseId) {
    try {
      return await this.repository.restore(backupPath, courseId);
    } catch (error) {
      console.error('CourseService: Error restoring course:', error);
      throw error;
    }
  }
}

export default CourseService;
