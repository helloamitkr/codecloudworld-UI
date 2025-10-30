# Nested Course Structure Guide

## 🎯 New Course Structure

You can now organize courses using a nested directory structure where each course has its own folder with separate lesson files.

## 📁 Directory Structure

### Option 1: Nested Structure (Recommended)
```
content/
├── courses/
│   ├── golang-tutorial/
│   │   ├── course_description.md    # Course overview and metadata
│   │   ├── lesson1.md              # Individual lesson files
│   │   ├── lesson2.md
│   │   ├── lesson3.md
│   │   └── ...
│   └── react-fundamentals/
│       ├── course_description.md
│       ├── lesson1.md
│       ├── lesson2.md
│       └── ...
```

### Option 2: Flat Structure (Legacy Support)
```
content/
├── courses/
│   ├── Course Name.md              # Single file with sections
│   └── Another Course.md
```

## 📝 File Formats

### Course Description File
**File**: `course_description.md` (or `description.md`)

```markdown
---
slug: "golang-tutorial"
title: "Golang Tutorial"
level: "Beginner"
tag: "Go"
description: "Complete beginner's guide to Go programming language"
duration: "2-3 hours"
lessons: 5
image: "https://example.com/course-image.jpg"
imageAlt: "Go programming course thumbnail"
featured: true
---

# Golang Tutorial

Course overview and description content here...

## Course Overview
Detailed description of what the course covers.

## What You'll Learn
- Key learning objectives
- Skills you'll gain

## Prerequisites
- Required knowledge
- Setup requirements

## Course Outline
- Lesson 1: Topic
- Lesson 2: Topic
- etc.
```

### Individual Lesson Files
**Files**: `lesson1.md`, `lesson2.md`, etc.

```markdown
---
slug: "introduction-setup"
title: "Introduction & Setup"
lesson: 1
duration: "30 minutes"
---

# Lesson 1: Introduction & Setup

Lesson content here with full markdown support...

## Learning Objectives
- What you'll learn in this lesson

## Content
Your lesson content with:
- Code examples
- Explanations
- Practice exercises

## Key Takeaways
- Summary points

## Next Steps
What's coming in the next lesson.
```

## 🔧 System Processing

### How It Works

1. **Course Detection**: System scans `content/courses/` for directories
2. **Description Loading**: Looks for `course_description.md` or `description.md`
3. **Lesson Processing**: Finds all `lesson*.md` files and processes them
4. **Navigation Generation**: Creates lesson-by-lesson navigation
5. **Progress Tracking**: Tracks completion per individual lesson

### Lesson Navigation

The system automatically creates:
- **Course Overview** (from description file)
- **Individual Lessons** (from lesson files)
- **Progress Tracking** (per lesson completion)
- **Next/Previous Navigation** (between lessons)

## 🎨 Benefits of Nested Structure

### ✅ Better Organization
- **Separate Files**: Each lesson is its own file
- **Easier Editing**: Focus on one lesson at a time
- **Version Control**: Better Git diffs and collaboration
- **Scalability**: Easy to add/remove/reorder lessons

### ✅ Enhanced Features
- **Individual Lesson URLs**: `/courses/golang-tutorial?lesson=introduction-setup`
- **Granular Progress**: Track completion per lesson
- **Flexible Content**: Each lesson can have different structure
- **Rich Metadata**: Duration, prerequisites per lesson

### ✅ Content Management
- **Modular Updates**: Update individual lessons without affecting others
- **Reusable Lessons**: Potentially share lessons between courses
- **Better Search**: Search within specific lessons
- **Detailed Analytics**: Track engagement per lesson

## 🚀 Creating Nested Courses

### Method 1: Admin Interface
1. Go to `/admin/create-content`
2. Select "Course" type
3. Check "Create Nested Course Structure"
4. Fill out the form
5. Download the generated files
6. Create the directory structure manually

### Method 2: CLI Tool
```bash
# Create course directory
mkdir content/courses/my-new-course

# Create course description
node scripts/create-content.js course "My New Course"
# Move the generated file to the course directory as course_description.md

# Create individual lessons
echo "---
slug: \"lesson-1\"
title: \"Getting Started\"
lesson: 1
duration: \"30 minutes\"
---

# Lesson 1: Getting Started

Your lesson content here..." > content/courses/my-new-course/lesson1.md
```

### Method 3: Manual Creation
1. Create course directory: `content/courses/course-name/`
2. Create `course_description.md` with course metadata
3. Create `lesson1.md`, `lesson2.md`, etc. with lesson content

## 📊 Lesson Metadata

### Required Fields
```yaml
slug: "unique-lesson-identifier"    # URL-safe identifier
title: "Lesson Title"               # Display title
lesson: 1                          # Lesson number (for ordering)
```

### Optional Fields
```yaml
duration: "30 minutes"             # Estimated completion time
prerequisites: ["lesson-1"]        # Required previous lessons
difficulty: "Beginner"             # Lesson-specific difficulty
objectives: ["Learn X", "Build Y"] # Learning objectives
resources: ["link1", "link2"]      # Additional resources
```

## 🔄 Backward Compatibility

The system supports both structures:

### Legacy Courses (Single File)
- Still work exactly as before
- Use section-based navigation
- Progress tracked by sections

### New Courses (Nested Structure)
- Use lesson-based navigation
- Progress tracked by individual lessons
- Enhanced metadata and features

## 🎯 Migration Guide

### Converting Existing Courses

1. **Create Directory**: `mkdir content/courses/course-name`
2. **Split Content**: Break existing course into:
   - `course_description.md` (overview, metadata)
   - `lesson1.md`, `lesson2.md`, etc. (individual lessons)
3. **Update Metadata**: Add lesson-specific frontmatter
4. **Test Navigation**: Verify lesson flow works correctly

### Example Migration

**Before** (Single File):
```markdown
---
slug: "react-basics"
title: "React Basics"
---

# React Basics

## Introduction
Content here...

## Components
Content here...

## State Management
Content here...
```

**After** (Nested Structure):
```
content/courses/react-basics/
├── course_description.md
├── lesson1.md (Introduction)
├── lesson2.md (Components)
└── lesson3.md (State Management)
```

## 🎨 Advanced Features

### Custom Lesson Types
```markdown
---
slug: "hands-on-project"
title: "Hands-on Project"
lesson: 5
type: "project"              # Special lesson type
duration: "2 hours"
difficulty: "Intermediate"
---
```

### Lesson Dependencies
```markdown
---
slug: "advanced-concepts"
title: "Advanced Concepts"
lesson: 4
prerequisites: ["lesson-1", "lesson-2", "lesson-3"]
---
```

### Rich Content Support
- **Code Examples**: Full syntax highlighting
- **Images**: Course and lesson-specific images
- **Videos**: Embed video content
- **Interactive Elements**: Quizzes, exercises
- **Downloads**: Supplementary materials

## 📈 Analytics & Tracking

The nested structure enables:
- **Lesson Completion Rates**: Track which lessons are completed most/least
- **Time Spent**: Monitor actual vs estimated lesson duration
- **Drop-off Points**: Identify where students stop progressing
- **Popular Content**: See which lessons are accessed most

## 🔧 Technical Implementation

### Content Processing Pipeline
1. **Directory Scan**: Find course directories
2. **Description Parse**: Load course metadata
3. **Lesson Discovery**: Find and sort lesson files
4. **Content Processing**: Convert markdown to HTML
5. **Navigation Generation**: Create lesson flow
6. **Progress Integration**: Enable completion tracking

### URL Structure
- Course Overview: `/courses/golang-tutorial`
- Specific Lesson: `/courses/golang-tutorial?lesson=introduction-setup`
- Progress Tracking: Stored per course in localStorage

This nested structure provides maximum flexibility while maintaining simplicity and backward compatibility! 🚀
