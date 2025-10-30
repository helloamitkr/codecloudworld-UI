import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

const CONTENT_TYPES = {
  blog: {
    name: 'Blog Post',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
      { name: 'read', label: 'Reading Time', type: 'text', defaultValue: '5 min' },
      { name: 'image', label: 'Featured Image URL', type: 'url', placeholder: 'https://example.com/image.jpg' },
      { name: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Descriptive text for the image' },
      { name: 'tags', label: 'Tags (comma-separated)', type: 'text', defaultValue: 'tutorial' },
      { name: 'author', label: 'Author', type: 'text', defaultValue: 'CodeCloudWorld' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'draft', label: 'Draft', type: 'checkbox' }
    ],
    contentTemplate: `# {{title}}

{{#image}}
![{{imageAlt}}]({{image}})
{{/image}}

Write your blog post content here...

## Introduction

Start with an engaging introduction.

## Main Content

Add your main content with code examples:

\`\`\`javascript
function example() {
  console.log("Hello, World!");
}
\`\`\`

## Conclusion

Wrap up your post with key takeaways.`
  },
  course: {
    name: 'Course',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
      { name: 'tag', label: 'Primary Tag', type: 'text', defaultValue: 'Programming' },
      { name: 'duration', label: 'Duration', type: 'text', defaultValue: '2-3 hours' },
      { name: 'lessons', label: 'Number of Lessons', type: 'number', defaultValue: 5 },
      { name: 'createNested', label: 'Create Nested Course Structure', type: 'checkbox', defaultValue: true },
      { name: 'image', label: 'Course Thumbnail URL', type: 'url', placeholder: 'https://example.com/course-image.jpg' },
      { name: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Course thumbnail description' },
      { name: 'featured', label: 'Featured', type: 'checkbox' }
    ],
    contentTemplate: `# {{title}}

{{#image}}
![{{imageAlt}}]({{image}})
{{/image}}

<div id="overview">

## Course Overview

Welcome to {{title}}! This comprehensive course will guide you through the fundamentals and advanced concepts step by step.

**What makes this course special:**
- Hands-on practical examples
- Real-world projects
- Progressive difficulty
- Expert guidance

</div>

<div id="learn">

## What You'll Learn

By the end of this course, you'll be able to:

- **Fundamental Concepts** - Master the core principles and terminology
- **Practical Skills** - Apply knowledge through hands-on exercises
- **Best Practices** - Learn industry-standard approaches and patterns
- **Real-world Application** - Build projects that demonstrate your expertise
- **Problem Solving** - Develop critical thinking skills for complex challenges

</div>

<div id="prerequisites">

## Prerequisites

Before starting this course, you should have:

- **Basic Programming Knowledge** - Understanding of variables, functions, and control flow
- **Development Environment** - Computer with internet access and text editor
- **Time Commitment** - Approximately {{duration}} of dedicated learning time
- **Motivation** - Eagerness to learn and practice new concepts

*Don't worry if you're missing some prerequisites - we'll guide you through the setup process!*

</div>

<div id="outline">

## Course Outline

This course is structured into progressive lessons that build upon each other:

### Lesson 1: Introduction & Setup
- Course overview and objectives
- Setting up your development environment
- Understanding the learning path ahead

### Lesson 2: Core Fundamentals
- Essential concepts and terminology
- Basic syntax and structure
- Your first practical example

### Lesson 3: Intermediate Concepts
- Building on the fundamentals
- More complex examples and use cases
- Common patterns and practices

### Lesson 4: Advanced Topics
- Advanced techniques and optimizations
- Real-world scenarios and solutions
- Performance considerations

### Lesson 5: Project & Next Steps
- Capstone project walkthrough
- Resources for continued learning
- Career and development paths

</div>

<div id="getting-started">

## Getting Started

Ready to begin your learning journey? Here's how to get started:

### Step 1: Prepare Your Environment
\`\`\`bash
# Example setup commands
# Update these based on your specific technology

# Install required tools
npm install -g create-app-tool

# Verify installation
tool --version
\`\`\`

### Step 2: Access Course Materials
- Bookmark this course page
- Join the community forum (if available)
- Download any required resources

### Step 3: Set Your Learning Schedule
- **Recommended pace**: 1 lesson per week
- **Time per lesson**: 30-60 minutes
- **Practice time**: 1-2 hours per lesson

### Step 4: Start Learning!
Click "Next →" to begin with Lesson 1, or use the navigation panel to jump to any section.

**Remember**: Learning is a journey, not a race. Take your time and practice regularly!

</div>`
  },
  project: {
    name: 'Project',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'stack', label: 'Tech Stack (comma-separated)', type: 'text', defaultValue: 'JavaScript, Node.js' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
      { name: 'demo', label: 'Demo URL', type: 'url' },
      { name: 'image', label: 'Project Screenshot URL', type: 'url', placeholder: 'https://example.com/project-screenshot.jpg' },
      { name: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Project screenshot description' },
      { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { name: 'category', label: 'Category', type: 'select', options: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Desktop'] },
      { name: 'featured', label: 'Featured', type: 'checkbox' }
    ],
    contentTemplate: `# {{title}}

{{#image}}
![{{imageAlt}}]({{image}})
{{/image}}

Project description and overview.

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- Technology 1
- Technology 2
- Technology 3

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/example/project
cd project

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Key Learning Points

- Learning point 1
- Learning point 2
- Learning point 3`
  }
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function generateFileName(title) {
  return title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim() + '.md';
}

export default function CreateContent() {
  const router = useRouter();
  const [contentType, setContentType] = useState('blog');
  const [formData, setFormData] = useState({});
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [generatedFile, setGeneratedFile] = useState('');

  const currentConfig = CONTENT_TYPES[contentType];

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const generateContent = () => {
    const title = formData.title || 'Untitled';
    const slug = generateSlug(title);
    const fileName = generateFileName(title);
    
    // Prepare frontmatter
    const frontmatter = {
      slug,
      title,
      ...formData
    };

    // Handle special field transformations
    if (frontmatter.tags && typeof frontmatter.tags === 'string') {
      frontmatter.tags = frontmatter.tags.split(',').map(tag => tag.trim());
    }
    if (frontmatter.stack && typeof frontmatter.stack === 'string') {
      frontmatter.stack = frontmatter.stack.split(',').map(tech => tech.trim());
    }

    // Generate content
    let contentBody = content || currentConfig.contentTemplate.replace(/{{title}}/g, title);
    
    // Handle conditional image blocks
    if (frontmatter.image) {
      contentBody = contentBody.replace(/{{#image}}([\s\S]*?){{\/image}}/g, '$1');
      contentBody = contentBody.replace(/{{image}}/g, frontmatter.image);
      contentBody = contentBody.replace(/{{imageAlt}}/g, frontmatter.imageAlt || title);
    } else {
      contentBody = contentBody.replace(/{{#image}}[\s\S]*?{{\/image}}/g, '');
    }
    
    // Create markdown file content
    const yamlFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        if (typeof value === 'boolean') {
          return `${key}: ${value}`;
        }
        if (typeof value === 'number') {
          return `${key}: ${value}`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const markdownFile = `---
${yamlFrontmatter}
---

${contentBody}`;

    setGeneratedFile(markdownFile);
    setPreview(true);
  };

  const downloadFile = () => {
    const title = formData.title || 'untitled';
    const fileName = generateFileName(title);
    const blob = new Blob([generatedFile], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedFile);
    alert('Content copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Content Generator</h1>
        <p>Create new blog posts, courses, and projects with ease</p>
      </div>

      <div className={styles.form}>
        <div className={styles.typeSelector}>
          <label>Content Type:</label>
          <select 
            value={contentType} 
            onChange={(e) => {
              setContentType(e.target.value);
              setFormData({});
              setContent('');
              setPreview(false);
            }}
            className={styles.select}
          >
            {Object.entries(CONTENT_TYPES).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.fields}>
          {currentConfig.fields.map((field) => (
            <div key={field.name} className={styles.field}>
              <label className={styles.label}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={styles.input}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  required={field.required}
                />
              )}
              
              {field.type === 'date' && (
                <input
                  type="date"
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={styles.input}
                  required={field.required}
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value))}
                  className={styles.input}
                  required={field.required}
                />
              )}
              
              {field.type === 'url' && (
                <input
                  type="url"
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={styles.input}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
              
              {field.type === 'select' && (
                <select
                  value={formData[field.name] || field.defaultValue || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={styles.select}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {field.type === 'checkbox' && (
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                  className={styles.checkbox}
                />
              )}
            </div>
          ))}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.contentTextarea}
            rows={15}
            placeholder={`Content will be auto-generated based on template, or write your own...`}
          />
        </div>

        <div className={styles.actions}>
          <button onClick={generateContent} className={styles.generateBtn}>
            Generate Markdown File
          </button>
        </div>

        {preview && (
          <div className={styles.preview}>
            <div className={styles.previewHeader}>
              <h3>Generated Markdown File</h3>
              <div className={styles.previewActions}>
                <button onClick={copyToClipboard} className={styles.copyBtn}>
                  Copy to Clipboard
                </button>
                <button onClick={downloadFile} className={styles.downloadBtn}>
                  Download File
                </button>
              </div>
            </div>
            <pre className={styles.previewContent}>
              <code>{generatedFile}</code>
            </pre>
            <div className={styles.instructions}>
              <p><strong>Instructions:</strong></p>
              <ol>
                <li>Copy the content above or download the file</li>
                <li>Save it as <code>{generateFileName(formData.title || 'untitled')}</code> in the <code>content/{contentType}s/</code> directory</li>
                <li>Run <code>npm run build</code> to regenerate static pages</li>
                <li>Your new content will be available at <code>/{contentType === 'blog' ? 'blog' : contentType + 's'}/{generateSlug(formData.title || 'untitled')}</code></li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
