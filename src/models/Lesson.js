/**
 * Lesson Model
 * Defines the structure and validation for lesson data
 */

class Lesson {
  constructor(data = {}) {
    this.id = data.id || null;
    this.courseId = data.courseId || null;
    this.slug = data.slug || '';
    this.title = data.title || '';
    this.content = data.content || '';
    this.contentHtml = data.contentHtml || '';
    this.duration = data.duration || '30 minutes';
    this.order = data.order || 1;
    this.objectives = data.objectives || [];
    this.prerequisites = data.prerequisites || [];
    this.resources = data.resources || [];
    this.exercises = data.exercises || [];
    this.status = data.status || 'draft'; // draft, published, archived
    this.difficulty = data.difficulty || 'beginner';
    this.estimatedTime = data.estimatedTime || 30; // in minutes
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.metadata = data.metadata || {};
  }

  // Validation rules
  static validationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    content: {
      required: true,
      minLength: 50
    },
    duration: {
      required: true,
      pattern: /^\d+\s+(minutes|hours)$/
    },
    slug: {
      required: true,
      pattern: /^[a-z0-9-]+$/,
      minLength: 3,
      maxLength: 100
    },
    order: {
      required: true,
      type: 'number',
      min: 1
    },
    difficulty: {
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  };

  // Validate lesson data
  validate() {
    const errors = [];
    const rules = Lesson.validationRules;

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

        // Check number constraints
        if (rule.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors.push(`${field} must be a number`);
          } else {
            if (rule.min && numValue < rule.min) {
              errors.push(`${field} must be at least ${rule.min}`);
            }
            if (rule.max && numValue > rule.max) {
              errors.push(`${field} must not exceed ${rule.max}`);
            }
          }
        }
      }
    });

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

  // Add learning objective
  addObjective(objective) {
    if (typeof objective === 'string' && objective.trim()) {
      this.objectives.push(objective.trim());
      this.updateTimestamp();
    }
  }

  // Add prerequisite
  addPrerequisite(prerequisite) {
    if (typeof prerequisite === 'string' && prerequisite.trim()) {
      this.prerequisites.push(prerequisite.trim());
      this.updateTimestamp();
    }
  }

  // Add resource
  addResource(resource) {
    if (typeof resource === 'object' && resource.title && resource.url) {
      this.resources.push({
        title: resource.title,
        url: resource.url,
        type: resource.type || 'link',
        description: resource.description || ''
      });
      this.updateTimestamp();
    }
  }

  // Add exercise
  addExercise(exercise) {
    if (typeof exercise === 'object' && exercise.title && exercise.description) {
      this.exercises.push({
        id: Date.now().toString(),
        title: exercise.title,
        description: exercise.description,
        type: exercise.type || 'practice',
        difficulty: exercise.difficulty || 'beginner',
        estimatedTime: exercise.estimatedTime || 15
      });
      this.updateTimestamp();
    }
  }

  // Update timestamp
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  // Get lesson statistics
  getStats() {
    return {
      wordCount: this.content.split(/\s+/).length,
      estimatedReadTime: Math.ceil(this.content.split(/\s+/).length / 200), // 200 words per minute
      objectives: this.objectives.length,
      prerequisites: this.prerequisites.length,
      resources: this.resources.length,
      exercises: this.exercises.length,
      difficulty: this.difficulty,
      status: this.status
    };
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      courseId: this.courseId,
      slug: this.slug,
      title: this.title,
      content: this.content,
      contentHtml: this.contentHtml,
      duration: this.duration,
      order: this.order,
      objectives: this.objectives,
      prerequisites: this.prerequisites,
      resources: this.resources,
      exercises: this.exercises,
      status: this.status,
      difficulty: this.difficulty,
      estimatedTime: this.estimatedTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: this.metadata,
      stats: this.getStats()
    };
  }

  // Create from markdown frontmatter
  static fromMarkdown(frontmatter, content) {
    const lesson = new Lesson({
      ...frontmatter,
      content: content,
      contentHtml: content // Will be processed later
    });
    
    if (!lesson.slug && lesson.title) {
      lesson.generateSlug();
    }
    
    return lesson;
  }

  // Generate markdown frontmatter
  toMarkdownFrontmatter() {
    return {
      slug: this.slug,
      title: this.title,
      lesson: this.order,
      duration: this.duration,
      difficulty: this.difficulty,
      objectives: this.objectives,
      prerequisites: this.prerequisites,
      estimatedTime: this.estimatedTime,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Generate lesson template
  static generateTemplate(data = {}) {
    const lesson = new Lesson(data);
    
    return `---
slug: "${lesson.slug}"
title: "${lesson.title}"
lesson: ${lesson.order}
duration: "${lesson.duration}"
difficulty: "${lesson.difficulty}"
objectives:
${lesson.objectives.map(obj => `  - "${obj}"`).join('\n') || '  - "Learning objective 1"\n  - "Learning objective 2"'}
prerequisites:
${lesson.prerequisites.map(pre => `  - "${pre}"`).join('\n') || '  - "Basic understanding of the topic"'}
estimatedTime: ${lesson.estimatedTime}
status: "${lesson.status}"
---

# Lesson ${lesson.order}: ${lesson.title}

## Lesson Content

Add your lesson material here.

---

**Estimated completion time**: ${lesson.duration}  
**Difficulty**: ${lesson.difficulty}
`;
  }
}

export default Lesson;
