import fs from 'fs';
import path from 'path';

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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    const coursesDir = path.join(process.cwd(), 'content/courses');
    
    // Find course directory by slug
    let courseDir = null;
    const directories = fs.readdirSync(coursesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const dir of directories) {
      const descriptionPath = path.join(coursesDir, dir.name, 'course_description.md');
      if (fs.existsSync(descriptionPath)) {
        const fileContents = fs.readFileSync(descriptionPath, 'utf8');
        const { data } = parseFrontmatter(fileContents);
        if (data.slug === slug) {
          courseDir = dir.name;
          break;
        }
      }
    }

    if (!courseDir) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const coursePath = path.join(coursesDir, courseDir);
    const descriptionPath = path.join(coursePath, 'course_description.md');
    
    // Load course description
    const descriptionContents = fs.readFileSync(descriptionPath, 'utf8');
    const { data: courseData, content: courseContent } = parseFrontmatter(descriptionContents);

    // Load lesson files
    const lessonFiles = fs.readdirSync(coursePath)
      .filter(file => file.startsWith('lesson') && file.endsWith('.md'))
      .sort();

    const lessons = [];
    for (const lessonFile of lessonFiles) {
      const lessonPath = path.join(coursePath, lessonFile);
      const lessonContents = fs.readFileSync(lessonPath, 'utf8');
      const { data: lessonData, content: lessonContent } = parseFrontmatter(lessonContents);
      
      lessons.push({
        title: lessonData.title || '',
        duration: lessonData.duration || '30 minutes',
        content: lessonContent,
        filename: lessonFile,
        ...lessonData
      });
    }

    const course = {
      ...courseData,
      content: courseContent,
      lessons: lessons,
      directory: courseDir
    };

    res.status(200).json(course);
  } catch (error) {
    console.error('Error loading course:', error);
    res.status(500).json({ message: 'Failed to load course' });
  }
}
