import { blogManager, courseManager, projectManager } from './content';

/**
 * Content type configurations
 */
export const CONTENT_TYPES = {
  blogs: {
    manager: blogManager,
    singular: 'blog',
    plural: 'blogs',
    basePath: '/blog',
    fields: ['title', 'date', 'read', 'excerpt', 'thumb', 'tags', 'author']
  },
  courses: {
    manager: courseManager,
    singular: 'course',
    plural: 'courses',
    basePath: '/courses',
    fields: ['title', 'level', 'tag', 'description', 'duration', 'lessons']
  },
  projects: {
    manager: projectManager,
    singular: 'project',
    plural: 'projects',
    basePath: '/projects',
    fields: ['title', 'stack', 'description', 'github', 'demo', 'difficulty', 'category']
  }
};

/**
 * Generic functions for any content type
 */

/**
 * Get all slugs for static generation
 */
export function getAllSlugs(contentType) {
  const config = CONTENT_TYPES[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  
  return config.manager.getAllSlugs();
}

/**
 * Get all items for a content type
 */
export function getAllItems(contentType) {
  const config = CONTENT_TYPES[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  
  return config.manager.getAllItems();
}

/**
 * Get single item by slug
 */
export async function getItemBySlug(contentType, slug) {
  const config = CONTENT_TYPES[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  
  return await config.manager.getItemBySlug(slug);
}

/**
 * Search items across content types
 */
export function searchAllContent(query) {
  const results = {};
  
  Object.keys(CONTENT_TYPES).forEach(contentType => {
    const config = CONTENT_TYPES[contentType];
    results[contentType] = config.manager.searchItems(query);
  });
  
  return results;
}

/**
 * Get recent items across all content types
 */
export function getRecentItems(limit = 10) {
  const allItems = [];
  
  Object.keys(CONTENT_TYPES).forEach(contentType => {
    const config = CONTENT_TYPES[contentType];
    const items = config.manager.getAllItems().map(item => ({
      ...item,
      contentType,
      basePath: config.basePath
    }));
    allItems.push(...items);
  });
  
  // Sort by date and limit
  return allItems
    .filter(item => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

/**
 * Get featured items (items with featured: true in frontmatter)
 */
export function getFeaturedItems() {
  const featuredItems = [];
  
  Object.keys(CONTENT_TYPES).forEach(contentType => {
    const config = CONTENT_TYPES[contentType];
    const items = config.manager.getAllItems()
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        contentType,
        basePath: config.basePath
      }));
    featuredItems.push(...items);
  });
  
  return featuredItems;
}

/**
 * Get items by tag
 */
export function getItemsByTag(tag) {
  const taggedItems = [];
  
  Object.keys(CONTENT_TYPES).forEach(contentType => {
    const config = CONTENT_TYPES[contentType];
    const items = config.manager.getAllItems()
      .filter(item => 
        item.tags?.includes(tag) || 
        item.tag === tag ||
        item.stack?.includes(tag)
      )
      .map(item => ({
        ...item,
        contentType,
        basePath: config.basePath
      }));
    taggedItems.push(...items);
  });
  
  return taggedItems;
}

/**
 * Content validation helpers
 */
export function validateContentItem(contentType, data) {
  const config = CONTENT_TYPES[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  
  const errors = [];
  
  // Check required fields
  if (!data.slug) errors.push('slug is required');
  if (!data.title) errors.push('title is required');
  
  // Content type specific validation
  if (contentType === 'blogs') {
    if (!data.date) errors.push('date is required for blogs');
    if (!data.excerpt) errors.push('excerpt is required for blogs');
  }
  
  if (contentType === 'courses') {
    if (!data.level) errors.push('level is required for courses');
  }
  
  if (contentType === 'projects') {
    if (!data.stack || !Array.isArray(data.stack)) {
      errors.push('stack array is required for projects');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get content statistics
 */
export function getContentStats() {
  const stats = {};
  
  Object.keys(CONTENT_TYPES).forEach(contentType => {
    const config = CONTENT_TYPES[contentType];
    const items = config.manager.getAllItems();
    
    stats[contentType] = {
      total: items.length,
      published: items.filter(item => !item.draft).length,
      drafts: items.filter(item => item.draft).length,
      featured: items.filter(item => item.featured).length
    };
  });
  
  return stats;
}
