import fs from 'fs';
import path from 'path';

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatterText = match[1];
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
    
    return { data };
  }
  
  return { data: {} };
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const coursesDir = path.join(process.cwd(), 'content/courses');
    
    if (!fs.existsSync(coursesDir)) {
      return res.status(200).json([]);
    }

    const courseDirectories = fs.readdirSync(coursesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const courses = [];

    for (const courseDir of courseDirectories) {
      const coursePath = path.join(coursesDir, courseDir);
      const descriptionPath = path.join(coursePath, 'course_description.md');
      
      if (fs.existsSync(descriptionPath)) {
        const fileContents = fs.readFileSync(descriptionPath, 'utf8');
        const { data } = parseFrontmatter(fileContents);
        
        // Count lesson files
        const lessonFiles = fs.readdirSync(coursePath)
          .filter(file => file.startsWith('lesson') && file.endsWith('.md'));
        
        courses.push({
          slug: data.slug || courseDir,
          title: data.title || courseDir,
          description: data.description || '',
          level: data.level || 'Beginner',
          tag: data.tag || 'Programming',
          duration: data.duration || '',
          lessons: lessonFiles.length,
          featured: data.featured || false,
          directory: courseDir
        });
      }
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error listing courses:', error);
    res.status(500).json({ message: 'Failed to list courses' });
  }
}
