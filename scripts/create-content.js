#!/usr/bin/env node

/**
 * Content Creation Utility
 * Usage: node scripts/create-content.js <type> <title>
 * Example: node scripts/create-content.js blog "My New Blog Post"
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_TYPES = {
  blog: {
    directory: 'content/blogs',
    template: {
      date: new Date().toISOString().split('T')[0],
      read: '5 min',
      excerpt: 'Brief description of the blog post',
      thumb: 'brand',
      tags: ['tutorial'],
      author: 'CodeCloudWorld',
      image: '',
      imageAlt: ''
    },
    content: `# {{title}}

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
    directory: 'content/courses',
    template: {
      level: 'Beginner',
      tag: 'Programming',
      description: 'Course description',
      duration: '2-3 hours',
      lessons: 5,
      image: '',
      imageAlt: ''
    },
    content: `# {{title}}

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
- **Time Commitment** - Approximately 2-3 hours of dedicated learning time
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
    directory: 'content/projects',
    template: {
      stack: ['JavaScript', 'Node.js'],
      description: 'Project description',
      github: 'https://github.com/example/project',
      demo: 'https://demo.example.com',
      difficulty: 'Intermediate',
      category: 'Full Stack',
      image: '',
      imageAlt: ''
    },
    content: `# {{title}}

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

function createContent(type, title) {
  const config = CONTENT_TYPES[type];
  if (!config) {
    console.error(`Unknown content type: ${type}`);
    console.error(`Available types: ${Object.keys(CONTENT_TYPES).join(', ')}`);
    process.exit(1);
  }

  const slug = generateSlug(title);
  const fileName = generateFileName(title);
  const filePath = path.join(process.cwd(), config.directory, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create frontmatter
  const frontmatter = {
    slug,
    title,
    ...config.template
  };

  // Create content with title replacement
  const content = config.content.replace(/{{title}}/g, title);

  // Generate markdown file
  const fileContent = matter.stringify(content, frontmatter);

  // Write file
  fs.writeFileSync(filePath, fileContent, 'utf8');

  console.log(`✅ Created ${type}: ${filePath}`);
  console.log(`📝 Slug: ${slug}`);
  console.log(`🔗 URL: /${type === 'blog' ? 'blog' : type + 's'}/${slug}`);
}

// CLI interface
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node scripts/create-content.js <type> <title>');
  console.log('Types: blog, course, project');
  console.log('Example: node scripts/create-content.js blog "My New Blog Post"');
  process.exit(1);
}

const [type, title] = args;
createContent(type, title);
