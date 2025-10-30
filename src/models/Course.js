/**
 * Course Model
 * Defines the structure and validation for course data
 */

class Course {
  constructor(data = {}) {
    this.id = data.id || null;
    this.slug = data.slug || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.level = data.level || 'Beginner';
    this.tag = data.tag || 'Programming';
    this.duration = data.duration || '';
    this.image = data.image || '';
    this.imageAlt = data.imageAlt || '';
    this.featured = data.featured || false;
    this.status = data.status || 'draft'; // draft, published, archived
    this.author = data.author || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.lessons = data.lessons || [];
    this.metadata = data.metadata || {};
    this.contentHtml = data.contentHtml || '';
  }

  // Validation rules
  static validationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    level: {
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    tag: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    duration: {
      required: true,
      pattern: /^\d+-\d+\s+(minutes|hours)$/
    },
    slug: {
      required: true,
      pattern: /^[a-z0-9-]+$/,
      minLength: 3,
      maxLength: 100
    }
  };

  // Validate course data
  validate() {
    const errors = [];
    const rules = Course.validationRules;

    // Check required fields
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = this[field];

      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        return;
      }

      if (value) {
        // Check string length
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${field} must not exceed ${rule.maxLength} characters`);
        }

        // Check enum values
        if (rule.enum && !rule.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
        }

        // Check patterns
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    });

    // Custom validations
    if (this.lessons.length === 0) {
      errors.push('Course must have at least one lesson');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate slug from title
  generateSlug() {
    if (!this.title) return '';
    
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    return this.slug;
  }

  // Add lesson to course
  addLesson(lesson) {
    if (!(lesson instanceof Lesson)) {
      throw new Error('Lesson must be an instance of Lesson class');
    }
    
    lesson.courseId = this.id;
    lesson.order = this.lessons.length + 1;
    this.lessons.push(lesson);
    this.updateTimestamp();
  }

  // Remove lesson from course
  removeLesson(lessonId) {
    this.lessons = this.lessons.filter(lesson => lesson.id !== lessonId);
    this.reorderLessons();
    this.updateTimestamp();
  }

  // Reorder lessons
  reorderLessons() {
    this.lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
  }

  // Update timestamp
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  // Get course statistics
  getStats() {
    return {
      totalLessons: this.lessons.length,
      estimatedDuration: this.duration,
      level: this.level,
      status: this.status,
      lastUpdated: this.updatedAt
    };
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      description: this.description,
      level: this.level,
      tag: this.tag,
      duration: this.duration,
      image: this.image,
      imageAlt: this.imageAlt,
      featured: this.featured,
      status: this.status,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lessons: this.lessons.map(lesson => lesson.toJSON ? lesson.toJSON() : lesson),
      metadata: this.metadata,
      stats: this.getStats()
    };
  }

  // Create from markdown frontmatter
  static fromMarkdown(frontmatter, content) {
    const course = new Course({
      ...frontmatter,
      contentHtml: content
    });
    
    if (!course.slug && course.title) {
      course.generateSlug();
    }
    
    return course;
  }

  // Generate markdown frontmatter
  toMarkdownFrontmatter() {
    return {
      slug: this.slug,
      title: this.title,
      level: this.level,
      tag: this.tag,
      description: this.description,
      duration: this.duration,
      lessons: this.lessons.length,
      image: this.image,
      imageAlt: this.imageAlt,
      featured: this.featured,
      status: this.status,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Course;
