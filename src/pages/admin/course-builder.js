import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function CourseBuilder() {
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    tag: 'Programming',
    duration: '2-3 hours',
    image: '',
    imageAlt: '',
    featured: false
  });
  
  const [lessons, setLessons] = useState([
    { title: '', duration: '30 minutes', content: '' }
  ]);
  
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [existingCourses, setExistingCourses] = useState([]);
  const [selectedExistingCourse, setSelectedExistingCourse] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', duration: '30 minutes', content: '' }]);
  };

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = lessons.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  // Load existing courses using model-based API
  const loadExistingCourses = async () => {
    try {
      const response = await fetch('/api/courses/model');
      const data = await response.json();
      setExistingCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load existing courses:', error);
      // Fallback to old API
      try {
        const fallbackResponse = await fetch('/api/courses/list');
        const courses = await fallbackResponse.json();
        setExistingCourses(courses);
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
    }
  };

  // Load specific course data for editing using model-based API
  const loadCourseForEditing = async (courseSlug) => {
    try {
      const response = await fetch(`/api/courses/model/${courseSlug}`);
      const data = await response.json();
      const courseData = data.course;
      
      // Populate form with existing data
      setCourseData({
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        tag: courseData.tag,
        duration: courseData.duration,
        image: courseData.image || '',
        imageAlt: courseData.imageAlt || '',
        featured: courseData.featured || false
      });
      
      // Load existing lessons
      if (courseData.lessons && courseData.lessons.length > 0) {
        setLessons(courseData.lessons.map(lesson => ({
          title: lesson.title,
          duration: lesson.duration,
          content: lesson.content
        })));
      }
      
      setSelectedExistingCourse(courseSlug);
    } catch (error) {
      console.error('Failed to load course:', error);
    }
  };

  // Process uploaded files (common logic)
  const processUploadedFiles = async (files) => {
    const courseFiles = {
      description: null,
      lessons: []
    };
    
    // Process uploaded files
    for (const file of files) {
      const content = await file.text();
      
      if (file.name.includes('course_description.md') || file.name.includes('description.md')) {
        courseFiles.description = content;
      } else if (file.name.includes('lesson') && file.name.endsWith('.md')) {
        courseFiles.lessons.push({
          filename: file.name,
          content: content
        });
      }
    }
    
    // Parse and populate form
    if (courseFiles.description) {
      const descriptionContent = parseMdFile(courseFiles.description);
      setCourseData({
        title: descriptionContent.frontmatter.title || '',
        description: descriptionContent.frontmatter.description || '',
        level: descriptionContent.frontmatter.level || 'Beginner',
        tag: descriptionContent.frontmatter.tag || 'Programming',
        duration: descriptionContent.frontmatter.duration || '2-3 hours',
        image: descriptionContent.frontmatter.image || '',
        imageAlt: descriptionContent.frontmatter.imageAlt || '',
        featured: descriptionContent.frontmatter.featured || false
      });
    }
    
    // Parse lessons
    if (courseFiles.lessons.length > 0) {
      const parsedLessons = courseFiles.lessons
        .sort((a, b) => a.filename.localeCompare(b.filename))
        .map(lesson => {
          const parsed = parseMdFile(lesson.content);
          return {
            title: parsed.frontmatter.title || '',
            duration: parsed.frontmatter.duration || '30 minutes',
            content: parsed.content
          };
        });
      setLessons(parsedLessons);
    }
    
    alert(`Successfully loaded ${courseFiles.description ? 'course description' : 'no description'} and ${courseFiles.lessons.length} lesson files!`);
  };

  // Handle folder upload (Method 2)
  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files);
    await processUploadedFiles(files);
  };

  // Handle multiple file selection (Method 1)
  const handleMultipleFiles = async (event) => {
    const files = Array.from(event.target.files);
    await processUploadedFiles(files);
  };

  // Handle individual file uploads (Method 3)
  const handleSingleFile = async (event, type) => {
    const files = Array.from(event.target.files);
    
    if (type === 'description' && files.length > 0) {
      const content = await files[0].text();
      const parsed = parseMdFile(content);
      setCourseData({
        title: parsed.frontmatter.title || '',
        description: parsed.frontmatter.description || '',
        level: parsed.frontmatter.level || 'Beginner',
        tag: parsed.frontmatter.tag || 'Programming',
        duration: parsed.frontmatter.duration || '2-3 hours',
        image: parsed.frontmatter.image || '',
        imageAlt: parsed.frontmatter.imageAlt || '',
        featured: parsed.frontmatter.featured || false
      });
      alert('Course description loaded successfully!');
    } else if (type === 'lessons' && files.length > 0) {
      const lessonFiles = [];
      for (const file of files) {
        const content = await file.text();
        lessonFiles.push({
          filename: file.name,
          content: content
        });
      }
      
      const parsedLessons = lessonFiles
        .sort((a, b) => a.filename.localeCompare(b.filename))
        .map(lesson => {
          const parsed = parseMdFile(lesson.content);
          return {
            title: parsed.frontmatter.title || '',
            duration: parsed.frontmatter.duration || '30 minutes',
            content: parsed.content
          };
        });
      
      setLessons(parsedLessons);
      alert(`${parsedLessons.length} lesson files loaded successfully!`);
    }
  };

  // Parse markdown file content
  const parseMdFile = (content) => {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const frontmatterText = match[1];
      const bodyContent = match[2];
      
      // Simple YAML parsing
      const frontmatter = {};
      frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
          frontmatter[key.trim()] = value === 'true' ? true : value === 'false' ? false : value;
        }
      });
      
      return { frontmatter, content: bodyContent.trim() };
    }
    
    return { frontmatter: {}, content: content };
  };

  const generateCourse = () => {
    // Validation before generation
    if (!courseData.title.trim()) {
      alert('❌ Course title is required!');
      return;
    }
    if (!courseData.description.trim()) {
      alert('❌ Course description is required!');
      return;
    }
    if (lessons.some(lesson => !lesson.title.trim())) {
      alert('❌ All lessons must have titles!');
      return;
    }
    
    // Clean up imageAlt if it contains URL
    let cleanImageAlt = courseData.imageAlt;
    if (cleanImageAlt && cleanImageAlt.startsWith('http')) {
      cleanImageAlt = courseData.title; // Fallback to course title
      alert('⚠️ Image alt text was a URL, using course title instead. Please provide proper alt text next time.');
    }
    
    const courseSlug = generateSlug(courseData.title);
    const files = [];

    // Generate course description file
    const courseDescription = `---
slug: "${courseSlug}"
title: "${courseData.title}"
level: "${courseData.level}"
tag: "${courseData.tag}"
description: "${courseData.description}"
duration: "${courseData.duration}"
lessons: ${lessons.length}
${courseData.image ? `image: "${courseData.image}"` : 'image: ""'}
${cleanImageAlt ? `imageAlt: "${cleanImageAlt}"` : 'imageAlt: ""'}
featured: ${courseData.featured}
---

# ${courseData.title}

${courseData.image ? `![${cleanImageAlt || courseData.title}](${courseData.image})` : ''}

## Course Overview

${courseData.description}

## Course Structure

This course contains ${lessons.length} lesson${lessons.length > 1 ? 's' : ''}:

${lessons.map((lesson, index) => `- **Lesson ${index + 1}**: ${lesson.title} (${lesson.duration})`).join('\n')}`;

    files.push({
      name: 'course_description.md',
      content: courseDescription,
      path: `content/courses/${courseSlug}/course_description.md`
    });

    // Generate lesson files
    lessons.forEach((lesson, index) => {
      const lessonSlug = generateSlug(lesson.title);
      const lessonContent = `---
slug: "${lessonSlug}"
title: "${lesson.title}"
lesson: ${index + 1}
duration: "${lesson.duration}"
---

# Lesson ${index + 1}: ${lesson.title}

${lesson.content || `## Lesson Content

Add your lesson material here.

${index < lessons.length - 1 ? `## Next Lesson\n\nContinue to Lesson ${index + 2}` : '## Course Complete\n\nCongratulations on completing this course!'}`}`;

      files.push({
        name: `lesson${index + 1}.md`,
        content: lessonContent,
        path: `content/courses/${courseSlug}/lesson${index + 1}.md`
      });
    });

    setGeneratedFiles(files);
    setShowPreview(true);
  };

  const downloadFile = (file) => {
    const blob = new Blob([file.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    generatedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 100);
    });
  };

  // Download as ZIP folder
  const downloadAsFolder = async () => {
    // Dynamic import of JSZip to avoid SSR issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    const courseSlug = generateSlug(courseData.title);
    const folderName = `${courseSlug}`;
    
    // Create course folder in ZIP
    const courseFolder = zip.folder(folderName);
    
    // Add all generated files to the folder
    generatedFiles.forEach(file => {
      courseFolder.file(file.name, file.content);
    });
    
    // Add README with setup instructions
    const readmeContent = `# ${courseData.title}

## Course Setup Instructions

This course has been generated using the Course Builder tool.

### 📁 Folder Structure
\`\`\`
${folderName}/
├── course_description.md    # Course metadata and overview
${lessons.map((_, index) => `├── lesson${index + 1}.md              # Lesson ${index + 1}`).join('\n')}
└── README.md               # This file
\`\`\`

### 🚀 Installation Steps

1. **Extract this ZIP file** to your project directory:
   \`\`\`bash
   unzip ${folderName}.zip
   \`\`\`

2. **Move to your Next.js project's content directory**:
   \`\`\`bash
   mv ${folderName} /path/to/your/project/content/courses/
   \`\`\`

3. **Rebuild your Next.js project**:
   \`\`\`bash
   npm run build
   \`\`\`

4. **Start your development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

### 🎯 Access Your Course

Your course will be available at:
- **URL**: \`http://localhost:3000/courses/${courseSlug}\`
- **Course List**: \`http://localhost:3000/courses\`

### 📊 Course Details

- **Title**: ${courseData.title}
- **Level**: ${courseData.level}
- **Duration**: ${courseData.duration}
- **Lessons**: ${lessons.length}
- **Technology**: ${courseData.tag}

### 🔧 Customization

You can edit any of the markdown files to customize:
- Course content and description
- Individual lesson content
- Metadata (title, duration, etc.)

After making changes, run \`npm run build\` to regenerate the static pages.

---
Generated by Course Builder Tool
`;
    
    courseFolder.file('README.md', readmeContent);
    
    // Generate ZIP file
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download the ZIP file
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`✅ Course folder "${folderName}.zip" downloaded successfully!\n\n📁 Contains:\n- All course files\n- README with setup instructions\n- Ready to extract and use!`);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      alert('❌ Error creating ZIP file. Please try downloading individual files.');
    }
  };

  const copyInstructions = () => {
    const courseSlug = generateSlug(courseData.title);
    const instructions = `# Course Creation Instructions

1. Create the course directory:
   mkdir -p content/courses/${courseSlug}

2. Save the files in the following structure:
   content/courses/${courseSlug}/
   ├── course_description.md
   ${lessons.map((_, index) => `   ├── lesson${index + 1}.md`).join('\n')}

3. Run the build command:
   npm run build

4. Your course will be available at:
   http://localhost:3000/courses/${courseSlug}`;

    navigator.clipboard.writeText(instructions);
    alert('Instructions copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Course Builder</h1>
        <p>Create structured courses with individual lesson files</p>
        <div style={{ marginTop: '1rem' }}>
          <a 
            href="/markdown-reference" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📝 Markdown Reference Guide
            <span style={{ fontSize: '0.8rem' }}>↗</span>
          </a>
        </div>
      </div>

      {/* Upload/Load Options */}
      <div className={styles.section}>
        <div className={styles.uploadOptions}>
          <button
            type="button"
            onClick={() => setUploadMode(!uploadMode)}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            {uploadMode ? '📝 Create New Course' : '📁 Upload Existing Course'}
          </button>
          
          <button
            type="button"
            onClick={loadExistingCourses}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            🔄 Load Previous Courses
          </button>
        </div>

        {/* Upload Options */}
        {uploadMode && (
          <div className={styles.uploadSection}>
            <h3>📁 Upload Course Files</h3>
            
            {/* Method 1: Multiple Files */}
            <div className={styles.uploadMethod}>
              <h4>Method 1: Select Multiple Files</h4>
              <p>Select all your course files at once (Ctrl+Click or Cmd+Click to select multiple)</p>
              <input
                type="file"
                multiple
                onChange={handleMultipleFiles}
                className={styles.fileInput}
                accept=".md"
              />
            </div>

            {/* Method 2: Folder Upload (if supported) */}
            <div className={styles.uploadMethod}>
              <h4>Method 2: Upload Folder (Chrome/Edge)</h4>
              <p>Select the entire course folder (works in Chrome and Edge browsers)</p>
              <input
                type="file"
                multiple
                webkitdirectory=""
                onChange={handleFolderUpload}
                className={styles.fileInput}
                accept=".md"
              />
            </div>

            {/* Method 3: Individual Files */}
            <div className={styles.uploadMethod}>
              <h4>Method 3: Upload Files One by One</h4>
              <div className={styles.individualUpload}>
                <div className={styles.uploadStep}>
                  <label>Course Description:</label>
                  <input
                    type="file"
                    onChange={(e) => handleSingleFile(e, 'description')}
                    className={styles.fileInput}
                    accept=".md"
                  />
                </div>
                <div className={styles.uploadStep}>
                  <label>Lesson Files:</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleSingleFile(e, 'lessons')}
                    className={styles.fileInput}
                    accept=".md"
                  />
                </div>
              </div>
            </div>

            <div className={styles.uploadHint}>
              <strong>Expected files:</strong>
              <ul>
                <li>course_description.md (required)</li>
                <li>lesson1.md, lesson2.md, lesson3.md... (optional)</li>
              </ul>
              <p><strong>Tip:</strong> If folder upload doesn't work, use Method 1 or 3</p>
            </div>
          </div>
        )}

        {/* Existing Courses List */}
        {existingCourses.length > 0 && (
          <div className={styles.existingCourses}>
            <h3>📚 Previous Courses</h3>
            <div className={styles.courseGrid}>
              {existingCourses.map((course, index) => (
                <div key={index} className={styles.courseCard}>
                  <h4>{course.title}</h4>
                  <p>{course.lessons} lessons • {course.level}</p>
                  <button
                    onClick={() => loadCourseForEditing(course.slug)}
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    ✏️ Edit Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!showPreview ? (
        <div className={styles.form}>
          {/* Course Information */}
          <div className={styles.section}>
            <h2>Course Information</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              📝 This information will be saved in <code>course_description.md</code>
            </p>
            
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Course Title *</label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  className={styles.input}
                  placeholder="e.g., Advanced React Development"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description *</label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Brief description of what the course covers"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Level</label>
                <select
                  value={courseData.level}
                  onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                  className={styles.select}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Primary Tag</label>
                <input
                  type="text"
                  value={courseData.tag}
                  onChange={(e) => setCourseData({...courseData, tag: e.target.value})}
                  className={styles.input}
                  placeholder="e.g., React, JavaScript, Python"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Duration</label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
                  className={styles.input}
                  placeholder="e.g., 2-3 hours, 1 week"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Course Image URL</label>
                <input
                  type="url"
                  value={courseData.image}
                  onChange={(e) => setCourseData({...courseData, image: e.target.value})}
                  className={styles.input}
                  placeholder="https://example.com/course-image.jpg"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Image Alt Text</label>
                <input
                  type="text"
                  value={courseData.imageAlt}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Warn if user enters URL in alt text
                    if (value.startsWith('http')) {
                      alert('⚠️ Alt text should describe the image, not be a URL!\nExample: "Go Programming Language Logo" instead of the image URL');
                    }
                    setCourseData({...courseData, imageAlt: value});
                  }}
                  className={styles.input}
                  placeholder="e.g., 'Go Programming Language Logo' (describe the image, not URL)"
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  💡 Describe what's in the image for accessibility (not the URL)
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={courseData.featured}
                    onChange={(e) => setCourseData({...courseData, featured: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Featured Course
                </label>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Lessons ({lessons.length})</h2>
              <button onClick={addLesson} className={styles.generateBtn}>
                + Add Lesson
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              📄 Each lesson will be saved as a separate file: <code>lesson1.md</code>, <code>lesson2.md</code>, etc.
            </p>

            {lessons.map((lesson, index) => (
              <div key={index} className={styles.lessonCard}>
                <div className={styles.lessonHeader}>
                  <h3>Lesson {index + 1}</h3>
                  {lessons.length > 1 && (
                    <button 
                      onClick={() => removeLesson(index)}
                      className={styles.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label}>Lesson Title *</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, 'title', e.target.value)}
                      className={styles.input}
                      placeholder={`e.g., Introduction to ${courseData.tag || 'Programming'}`}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Duration</label>
                    <input
                      type="text"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                      className={styles.input}
                      placeholder="e.g., 30 minutes"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Lesson Content (Optional)</label>
                    <textarea
                      value={lesson.content}
                      onChange={(e) => updateLesson(index, 'content', e.target.value)}
                      className={styles.contentTextarea}
                      rows={6}
                      placeholder="Add lesson content here, or leave empty to use the default template..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button onClick={generateCourse} className={styles.generateBtn}>
              Generate Course Files
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <h3>Generated Course Files</h3>
            <div className={styles.previewActions}>
              <button onClick={copyInstructions} className={styles.copyBtn}>
                Copy Instructions
              </button>
              <button onClick={downloadAllFiles} className={styles.downloadBtn}>
                📄 Download Individual Files
              </button>
              <button onClick={downloadAsFolder} className={styles.downloadBtn}>
                📁 Download as Folder (ZIP)
              </button>
              <button onClick={() => setShowPreview(false)} className={styles.copyBtn}>
                ← Back to Editor
              </button>
            </div>
          </div>

          <div className={styles.fileList}>
            {generatedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileHeader}>
                  <h4>{file.name}</h4>
                  <button onClick={() => downloadFile(file)} className={styles.downloadBtn}>
                    Download
                  </button>
                </div>
                <div className={styles.filePath}>{file.path}</div>
                <pre className={styles.filePreview}>
                  <code>{file.content.substring(0, 500)}...</code>
                </pre>
              </div>
            ))}
          </div>

          <div className={styles.instructions}>
            <h3>Setup Instructions</h3>
            <ol>
              <li>Create the course directory: <code>mkdir -p content/courses/{generateSlug(courseData.title)}</code></li>
              <li>Download all files and place them in the course directory</li>
              <li>Run <code>npm run build</code> to regenerate your site</li>
              <li>Your course will be available at <code>/courses/{generateSlug(courseData.title)}</code></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
