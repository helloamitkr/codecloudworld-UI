import fs from 'fs';
import path from 'path';

const contentRoot = path.join(process.cwd(), 'content');

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatterText = match[1];
    const markdownContent = match[2];
    
    // Parse frontmatter
    const data = {};
    const lines = frontmatterText.split('\n');
    let currentKey = null;
    let currentArray = [];
    let inArray = false;
    let inMultiline = false;
    let multilineValue = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle array items
      if (line.trim().startsWith('- ')) {
        if (inArray && currentKey) {
          const item = line.trim().substring(2).trim();
          currentArray.push(item);
        }
        continue;
      }
      
      // Handle multiline continuation
      if (inMultiline) {
        if (line.trim() === '' || line.startsWith('  ')) {
          multilineValue += (multilineValue ? '\n' : '') + line.trim();
          continue;
        } else {
          // End of multiline, save it
          if (currentKey) {
            data[currentKey] = multilineValue;
          }
          inMultiline = false;
          multilineValue = '';
        }
      }
      
      // Save previous array if we're starting a new key
      if (inArray && currentKey && !line.trim().startsWith('- ')) {
        data[currentKey] = currentArray;
        inArray = false;
        currentArray = [];
      }
      
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        currentKey = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Handle different value types
        if (value === '') {
          // This might be an array or multiline string
          inArray = true;
          currentArray = [];
        } else if (value.startsWith('"') && value.endsWith('"')) {
          data[currentKey] = value.slice(1, -1); // Remove quotes
        } else if (value.startsWith("'") && value.endsWith("'")) {
          data[currentKey] = value.slice(1, -1); // Remove quotes
        } else if (value === 'true') {
          data[currentKey] = true;
        } else if (value === 'false') {
          data[currentKey] = false;
        } else if (!isNaN(value) && value !== '') {
          data[currentKey] = Number(value);
        } else if (value.startsWith('>-')) {
          // Handle multiline strings
          inMultiline = true;
          multilineValue = value.substring(2).trim();
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Handle JSON arrays like ["Go", "Chi", "PostgreSQL"]
          try {
            data[currentKey] = JSON.parse(value);
          } catch (e) {
            data[currentKey] = value;
          }
        } else {
          data[currentKey] = value;
        }
      }
    }
    
    // Handle final array or multiline
    if (inArray && currentKey) {
      data[currentKey] = currentArray;
    }
    if (inMultiline && currentKey) {
      data[currentKey] = multilineValue;
    }
    
    return {
      data,
      content: markdownContent.trim()
    };
  }
  
  return {
    data: {},
    content: content
  };
}

/**
 * Simple markdown to HTML conversion
 */
function processMarkdown(content) {
  let html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code blocks with language
    .replace(/```(\w+)?\n?([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    // Code blocks without language
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');
  
  // Wrap in paragraphs
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  
  return html;
}

/**
 * Stringify frontmatter and content
 */
function stringifyFrontmatter(content, frontmatter) {
  let markdown = '---\n';
  
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      markdown += `${key}:\n`;
      value.forEach(item => {
        markdown += `  - ${item}\n`;
      });
    } else if (typeof value === 'string' && (value.includes('\n') || value.length > 50)) {
      // Handle multiline strings
      markdown += `${key}: >-\n`;
      const lines = value.split('\n');
      lines.forEach(line => {
        markdown += `  ${line}\n`;
      });
    } else {
      markdown += `${key}: ${typeof value === 'string' ? `'${value}'` : value}\n`;
    }
  });
  
  markdown += '---\n\n';
  markdown += content;
  
  return markdown;
}

/**
 * Generic content management system
 * Supports blogs, courses, projects, and any future content types
 */
class ContentManager {
  constructor(contentType) {
    this.contentType = contentType;
    this.contentDirectory = path.join(contentRoot, contentType);
    
    // Ensure directory exists
    if (!fs.existsSync(this.contentDirectory)) {
      fs.mkdirSync(this.contentDirectory, { recursive: true });
    }
  }

  /**
   * Get all slugs for static generation
   * Supports both flat files and nested directory structure
   */
  getAllSlugs() {
    if (!fs.existsSync(this.contentDirectory)) {
      return [];
    }

    const slugs = [];
    const entries = fs.readdirSync(this.contentDirectory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        // Handle flat markdown files
        const fullPath = path.join(this.contentDirectory, entry.name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = parseFrontmatter(fileContents);
        
        if (data.slug) {
          slugs.push({
            params: {
              slug: data.slug,
            },
          });
        }
      } else if (entry.isDirectory()) {
        // Handle nested course directories
        const courseDir = path.join(this.contentDirectory, entry.name);
        const courseFiles = fs.readdirSync(courseDir);
        
        // Look for course_description.md
        const descriptionFile = courseFiles.find(file => 
          file === 'course_description.md' || file === 'description.md'
        );
        
        if (descriptionFile) {
          const fullPath = path.join(courseDir, descriptionFile);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = parseFrontmatter(fileContents);
          
          if (data.slug) {
            slugs.push({
              params: {
                slug: data.slug,
              },
            });
          }
        }
      }
    }

    return slugs;
  }

  /**
   * Get all content items with metadata
   * Supports both flat files and nested directory structure
   */
  getAllItems() {
    if (!fs.existsSync(this.contentDirectory)) {
      return [];
    }

    const items = [];
    const entries = fs.readdirSync(this.contentDirectory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        // Handle flat markdown files
        const fullPath = path.join(this.contentDirectory, entry.name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = parseFrontmatter(fileContents);
        
        if (data.slug) {
          items.push({
            ...data,
            fileName: entry.name,
            type: 'single'
          });
        }
      } else if (entry.isDirectory()) {
        // Handle nested course directories
        const courseDir = path.join(this.contentDirectory, entry.name);
        const courseFiles = fs.readdirSync(courseDir);
        
        // Look for course_description.md
        const descriptionFile = courseFiles.find(file => 
          file === 'course_description.md' || file === 'description.md'
        );
        
        if (descriptionFile) {
          const fullPath = path.join(courseDir, descriptionFile);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = parseFrontmatter(fileContents);
          
          // Get lesson files
          const lessonFiles = courseFiles
            .filter(file => file.startsWith('lesson') && file.endsWith('.md'))
            .sort();
          
          if (data.slug) {
            items.push({
              ...data,
              fileName: descriptionFile,
              courseDirectory: entry.name,
              lessonFiles,
              type: 'course'
            });
          }
        }
      }
    }

    return items.filter(item => item.slug);
  }

  /**
   * Get single content item by slug with processed content
   * Supports both flat files and nested course directories
   */
  async getItemBySlug(slug) {
    if (!fs.existsSync(this.contentDirectory)) {
      return null;
    }

    const entries = fs.readdirSync(this.contentDirectory, { withFileTypes: true });
    
    // Search in flat files first
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = path.join(this.contentDirectory, entry.name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = parseFrontmatter(fileContents);
        
        if (data.slug === slug) {
          const processedContent = processMarkdown(content);
          
          return {
            slug: data.slug,
            contentHtml: processedContent,
            fileName: entry.name,
            type: 'single',
            ...data,
          };
        }
      }
    }

    // Search in nested course directories
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const courseDir = path.join(this.contentDirectory, entry.name);
        const courseFiles = fs.readdirSync(courseDir);
        
        const descriptionFile = courseFiles.find(file => 
          file === 'course_description.md' || file === 'description.md'
        );
        
        if (descriptionFile) {
          const fullPath = path.join(courseDir, descriptionFile);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = parseFrontmatter(fileContents);
          
          if (data.slug === slug) {
            // Get lesson files and process them
            const lessonFiles = courseFiles
              .filter(file => file.startsWith('lesson') && file.endsWith('.md'))
              .sort();
            
            const lessons = [];
            for (const lessonFile of lessonFiles) {
              const lessonPath = path.join(courseDir, lessonFile);
              const lessonContents = fs.readFileSync(lessonPath, 'utf8');
              const { data: lessonData, content: lessonContent } = parseFrontmatter(lessonContents);
              
              const processedLesson = processMarkdown(lessonContent);
              
              lessons.push({
                ...lessonData,
                fileName: lessonFile,
                contentHtml: processedLesson,
              });
            }
            
            const processedContent = processMarkdown(content);
            
            return {
              slug: data.slug,
              contentHtml: processedContent,
              fileName: descriptionFile,
              courseDirectory: entry.name,
              type: 'course',
              ...data,
              lessons, // Put lessons after ...data to avoid being overwritten
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Create a new content item
   */
  createItem(slug, frontmatter, content = '') {
    const fileName = this.generateFileName(frontmatter.title || slug);
    const fullPath = path.join(this.contentDirectory, fileName);
    
    if (fs.existsSync(fullPath)) {
      throw new Error(`File already exists: ${fileName}`);
    }

    const fileContent = stringifyFrontmatter(content, { slug, ...frontmatter });
    fs.writeFileSync(fullPath, fileContent, 'utf8');
    
    return fileName;
  }

  /**
   * Update an existing content item
   */
  async updateItem(slug, frontmatter, content) {
    const item = await this.getItemBySlug(slug);
    if (!item) {
      throw new Error(`Item not found: ${slug}`);
    }

    const fullPath = path.join(this.contentDirectory, item.fileName);
    const fileContent = stringifyFrontmatter(content, { slug, ...frontmatter });
    fs.writeFileSync(fullPath, fileContent, 'utf8');
    
    return item.fileName;
  }

  /**
   * Delete a content item
   */
  async deleteItem(slug) {
    const item = await this.getItemBySlug(slug);
    if (!item) {
      throw new Error(`Item not found: ${slug}`);
    }

    const fullPath = path.join(this.contentDirectory, item.fileName);
    fs.unlinkSync(fullPath);
    
    return true;
  }

  /**
   * Generate a safe filename from title
   */
  generateFileName(title) {
    const safeName = title
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    return `${safeName}.md`;
  }

  /**
   * Search content items
   */
  searchItems(query) {
    const allItems = this.getAllItems();
    const lowerQuery = query.toLowerCase();
    
    return allItems.filter(item => 
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.excerpt?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

// Export pre-configured instances
export const blogManager = new ContentManager('blogs');
export const courseManager = new ContentManager('courses');
export const projectManager = new ContentManager('projects');

// Export the class for custom content types
export default ContentManager;
