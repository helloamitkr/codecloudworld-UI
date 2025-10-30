/**
 * Course Repository
 * Handles data persistence and retrieval for courses
 */

import fs from 'fs';
import path from 'path';
import Course from './Course.js';
import Lesson from './Lesson.js';

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatterText = match[1];
    const markdownContent = match[2];
    
    const data = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          data[key] = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          data[key] = value.slice(1, -1);
        } else if (value === 'true') {
          data[key] = true;
        } else if (value === 'false') {
          data[key] = false;
        } else if (!isNaN(value) && value !== '') {
          data[key] = Number(value);
        } else {
          data[key] = value;
        }
      }
    }
    
    return { data, content: markdownContent.trim() };
  }
  
  return { data: {}, content: content };
}

// Simple frontmatter stringifier
function stringifyFrontmatter(content, frontmatter) {
  let markdown = '---\n';
  
  Object.entries(frontmatter).forEach(([key, value]) => {
    markdown += `${key}: ${typeof value === 'string' ? `'${value}'` : value}\n`;
  });
  
  markdown += '---\n\n';
  markdown += content;
  
  return markdown;
}

class CourseRepository {
  constructor(basePath = 'content/courses') {
    this.basePath = path.join(process.cwd(), basePath);
    this.ensureDirectoryExists();
  }

  // Ensure base directory exists
  ensureDirectoryExists() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  // Get all courses
  async findAll(options = {}) {
    const { status = null, featured = null, tag = null } = options;
    
    try {
      const courseDirectories = fs.readdirSync(this.basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      const courses = [];

      for (const courseDir of courseDirectories) {
        const course = await this.findByDirectory(courseDir);
        if (course) {
          // Apply filters
          if (status && course.status !== status) continue;
          if (featured !== null && course.featured !== featured) continue;
          if (tag && course.tag !== tag) continue;
          
          courses.push(course);
        }
      }

      // Sort by creation date (newest first)
      return courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error finding courses:', error);
      return [];
    }
  }

  // Find course by slug
  async findBySlug(slug) {
    try {
      const courseDirectories = fs.readdirSync(this.basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

      for (const dir of courseDirectories) {
        const course = await this.findByDirectory(dir.name);
        if (course && course.slug === slug) {
          return course;
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding course by slug:', error);
      return null;
    }
  }

  // Find course by directory name
  async findByDirectory(directoryName) {
    try {
      const coursePath = path.join(this.basePath, directoryName);
      const descriptionPath = path.join(coursePath, 'course_description.md');

      if (!fs.existsSync(descriptionPath)) {
        return null;
      }

      // Read course description
      const descriptionContent = fs.readFileSync(descriptionPath, 'utf8');
      const { data: courseData, content: courseContent } = parseFrontmatter(descriptionContent);

      // Create course instance
      const course = Course.fromMarkdown(courseData, courseContent);
      course.id = directoryName;

      // Load lessons
      const lessons = await this.loadLessons(coursePath, course.id);
      course.lessons = lessons;

      return course;
    } catch (error) {
      console.error('Error finding course by directory:', error);
      return null;
    }
  }

  // Load lessons for a course
  async loadLessons(coursePath, courseId) {
    try {
      const lessonFiles = fs.readdirSync(coursePath)
        .filter(file => file.startsWith('lesson') && file.endsWith('.md'))
        .sort();

      const lessons = [];

      for (const lessonFile of lessonFiles) {
        const lessonPath = path.join(coursePath, lessonFile);
        const lessonContent = fs.readFileSync(lessonPath, 'utf8');
        const { data: lessonData, content: lessonMarkdown } = parseFrontmatter(lessonContent);

        const lesson = Lesson.fromMarkdown(lessonData, lessonMarkdown);
        lesson.id = lessonFile.replace('.md', '');
        lesson.courseId = courseId;
        lesson.fileName = lessonFile;

        lessons.push(lesson);
      }

      return lessons;
    } catch (error) {
      console.error('Error loading lessons:', error);
      return [];
    }
  }

  // Save course
  async save(course) {
    if (!(course instanceof Course)) {
      throw new Error('Course must be an instance of Course class');
    }

    // Validate course
    const validation = course.validate();
    if (!validation.isValid) {
      throw new Error(`Course validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      // Generate ID if not exists
      if (!course.id) {
        course.id = course.slug || course.generateSlug();
      }

      const coursePath = path.join(this.basePath, course.id);
      
      // Create course directory
      if (!fs.existsSync(coursePath)) {
        fs.mkdirSync(coursePath, { recursive: true });
      }

      // Update timestamp
      course.updateTimestamp();

      // Save course description
      await this.saveCourseDescription(course, coursePath);

      // Save lessons
      await this.saveLessons(course.lessons, coursePath);

      return course;
    } catch (error) {
      console.error('Error saving course:', error);
      throw error;
    }
  }

  // Save course description file
  async saveCourseDescription(course, coursePath) {
    const frontmatter = course.toMarkdownFrontmatter();
    const content = stringifyFrontmatter(course.contentHtml || '', frontmatter);
    const filePath = path.join(coursePath, 'course_description.md');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }

  // Save lesson files
  async saveLessons(lessons, coursePath) {
    for (const lesson of lessons) {
      if (!(lesson instanceof Lesson)) {
        console.warn('Skipping invalid lesson:', lesson);
        continue;
      }

      // Validate lesson
      const validation = lesson.validate();
      if (!validation.isValid) {
        console.warn(`Lesson validation failed: ${validation.errors.join(', ')}`);
        continue;
      }

      // Generate filename
      const fileName = `lesson${lesson.order}.md`;
      const filePath = path.join(coursePath, fileName);

      // Generate content
      const frontmatter = lesson.toMarkdownFrontmatter();
      const content = stringifyFrontmatter(lesson.content || '', frontmatter);

      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  // Delete course
  async delete(courseId) {
    try {
      const coursePath = path.join(this.basePath, courseId);
      
      if (fs.existsSync(coursePath)) {
        fs.rmSync(coursePath, { recursive: true, force: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // Get course statistics
  async getStats() {
    try {
      const courses = await this.findAll();
      
      const stats = {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.status === 'published').length,
        draftCourses: courses.filter(c => c.status === 'draft').length,
        featuredCourses: courses.filter(c => c.featured).length,
        totalLessons: courses.reduce((sum, c) => sum + c.lessons.length, 0),
        coursesByLevel: {
          beginner: courses.filter(c => c.level === 'Beginner').length,
          intermediate: courses.filter(c => c.level === 'Intermediate').length,
          advanced: courses.filter(c => c.level === 'Advanced').length
        },
        coursesByTag: {}
      };

      // Count courses by tag
      courses.forEach(course => {
        stats.coursesByTag[course.tag] = (stats.coursesByTag[course.tag] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }

  // Search courses
  async search(query, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    try {
      const allCourses = await this.findAll();
      const searchTerm = query.toLowerCase();

      const results = allCourses.filter(course => {
        return course.title.toLowerCase().includes(searchTerm) ||
               course.description.toLowerCase().includes(searchTerm) ||
               course.tag.toLowerCase().includes(searchTerm) ||
               course.lessons.some(lesson => 
                 lesson.title.toLowerCase().includes(searchTerm) ||
                 lesson.content.toLowerCase().includes(searchTerm)
               );
      });

      return {
        results: results.slice(offset, offset + limit),
        total: results.length,
        hasMore: results.length > offset + limit
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return { results: [], total: 0, hasMore: false };
    }
  }

  // Backup course
  async backup(courseId, backupPath) {
    try {
      const course = await this.findByDirectory(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const sourcePath = path.join(this.basePath, courseId);
      const targetPath = path.join(backupPath, `${courseId}_backup_${Date.now()}`);

      // Copy directory recursively
      fs.cpSync(sourcePath, targetPath, { recursive: true });

      return targetPath;
    } catch (error) {
      console.error('Error backing up course:', error);
      throw error;
    }
  }

  // Restore course from backup
  async restore(backupPath, courseId) {
    try {
      const targetPath = path.join(this.basePath, courseId);
      
      // Remove existing course if it exists
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }

      // Copy backup to target location
      fs.cpSync(backupPath, targetPath, { recursive: true });

      return await this.findByDirectory(courseId);
    } catch (error) {
      console.error('Error restoring course:', error);
      throw error;
    }
  }
}

export default CourseRepository;
