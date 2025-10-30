import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function BlogBuilder() {
  const router = useRouter();
  const { edit } = router.query;
  
  const [postData, setPostData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    author: 'John Developer',
    authorEmail: 'john@example.com',
    category: 'Web Development',
    tags: [],
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: '',
    status: 'published',
    featured: false,
    publishedAt: new Date().toISOString(),
    readTime: 5,
    views: 0,
    likes: 0,
    seoTitle: '',
    seoDescription: '',
    content: ''
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingPosts, setExistingPosts] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const categories = [
    'Web Development', 'Programming', 'Technology', 'Mobile Development',
    'Data Science', 'AI & Machine Learning', 'DevOps', 'Design',
    'Business', 'Tutorial', 'News', 'General'
  ];

  const commonTags = [
    'nextjs', 'react', 'javascript', 'typescript', 'tutorial',
    'web development', 'programming', 'frontend', 'backend', 'fullstack',
    'nodejs', 'css', 'html', 'api', 'database'
  ];

  const templates = {
    tutorial: {
      name: 'Tutorial Post',
      content: `# How to [Topic]

## Introduction

Brief introduction to what readers will learn and why it's important.

## Prerequisites

Before starting, make sure you have:
- Prerequisite 1
- Prerequisite 2
- Prerequisite 3

## Step-by-Step Guide

### Step 1: [First Step]

Explain the first step with clear instructions.

\`\`\`javascript
// Code example
function example() {
  return "Hello World";
}
\`\`\`

### Step 2: [Second Step]

Continue with the next step.

### Step 3: [Final Step]

Complete the tutorial.

## Troubleshooting

Common issues and solutions:
- **Issue 1**: Solution description
- **Issue 2**: Solution description

## Conclusion

Summarize what was accomplished and next steps.

## Resources

- [Resource 1](https://example.com)
- [Resource 2](https://example.com)`
    },
    review: {
      name: 'Product/Tool Review',
      content: `# [Product Name] Review: [Subtitle]

## Overview

Brief overview of what you're reviewing and your overall impression.

## Pros and Cons

### ✅ Pros
- Advantage 1
- Advantage 2
- Advantage 3

### ❌ Cons
- Disadvantage 1
- Disadvantage 2
- Disadvantage 3

## Features

### Feature 1
Description and evaluation.

### Feature 2
Description and evaluation.

### Feature 3
Description and evaluation.

## Pricing

Pricing information and value assessment.

## Alternatives

Brief mention of alternatives and comparisons.

## Final Verdict

⭐ **Rating**: X/5 stars

**Recommendation**: Who should use this and why.

## Bottom Line

Final thoughts and recommendation.`
    },
    news: {
      name: 'News/Update Post',
      content: `# [News Title]: [Subtitle]

## What Happened

Brief summary of the news or update.

## Key Details

- **When**: Date/timeframe
- **Who**: People/companies involved
- **What**: Specific details
- **Where**: Location/platform
- **Why**: Context and reasons

## Impact

### For Developers
How this affects developers.

### For Users
How this affects end users.

### For the Industry
Broader industry implications.

## What's Next

Expected follow-up developments and timeline.

## Our Take

Editorial opinion and analysis.

## Resources

- [Official announcement](https://example.com)
- [Additional coverage](https://example.com)`
    },
    listicle: {
      name: 'List Article',
      content: `# X [Topic] Every [Audience] Should Know

## Introduction

Why this list matters and what readers will gain.

## 1. [First Item]

**Description**: Brief explanation.

**Why it matters**: Importance and benefits.

**How to use it**: Practical application.

## 2. [Second Item]

**Description**: Brief explanation.

**Why it matters**: Importance and benefits.

**How to use it**: Practical application.

## 3. [Third Item]

**Description**: Brief explanation.

**Why it matters**: Importance and benefits.

**How to use it**: Practical application.

## 4. [Fourth Item]

**Description**: Brief explanation.

**Why it matters**: Importance and benefits.

**How to use it**: Practical application.

## 5. [Fifth Item]

**Description**: Brief explanation.

**Why it matters**: Importance and benefits.

**How to use it**: Practical application.

## Bonus Tips

Additional quick tips or resources.

## Conclusion

Summary and call to action.`
    }
  };

  useEffect(() => {
    if (edit) {
      loadPostForEditing(edit);
    }
    loadExistingPosts();
  }, [edit]);

  const loadExistingPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setExistingPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load existing posts:', error);
    }
  };

  const loadPostForEditing = async (slug) => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();
      const post = data.post;
      
      setPostData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        authorEmail: post.authorEmail || '',
        category: post.category || 'Technology',
        tags: post.tags || [],
        featuredImage: post.featuredImage || '',
        featuredImageAlt: post.featuredImageAlt || '',
        status: post.status || 'draft',
        featured: post.featured || false,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || ''
      });
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load post for editing');
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  // Calculate estimated read time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleInputChange = (field, value) => {
    setPostData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };

      // Auto-generate slug when title changes
      if (field === 'title') {
        updated.slug = generateSlug(value);
        // Auto-generate featuredImageAlt if empty
        if (!prev.featuredImageAlt) {
          updated.featuredImageAlt = value + ' - Blog post image';
        }
      }

      // Auto-calculate read time when content changes
      if (field === 'content') {
        updated.readTime = calculateReadTime(value);
      }

      // Auto-generate excerpt if empty and content is provided
      if (field === 'content' && !prev.excerpt && value.length > 100) {
        const firstParagraph = value.split('\n\n')[0];
        updated.excerpt = firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : '');
      }

      return updated;
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !postData.tags.includes(currentTag.trim().toLowerCase())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateExcerpt = (content) => {
    const plainText = content
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .trim();
    
    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...'
      : plainText;
  };

  const handlePreview = async () => {
    if (!postData.content) {
      alert('Please add some content to preview');
      return;
    }

    setLoading(true);
    try {
      // Process markdown to HTML (you can implement this or use a library)
      const processedContent = postData.content
        .replace(/#{6}\s+(.*)/g, '<h6>$1</h6>')
        .replace(/#{5}\s+(.*)/g, '<h5>$1</h5>')
        .replace(/#{4}\s+(.*)/g, '<h4>$1</h4>')
        .replace(/#{3}\s+(.*)/g, '<h3>$1</h3>')
        .replace(/#{2}\s+(.*)/g, '<h2>$1</h2>')
        .replace(/#{1}\s+(.*)/g, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      setPreviewHtml(`<p>${processedContent}</p>`);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status = 'draft') => {
    if (!postData.title || !postData.content || !postData.author) {
      alert('Please fill in title, content, and author fields');
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(postData.title);
      const excerpt = postData.excerpt || generateExcerpt(postData.content);
      const readTime = calculateReadTime(postData.content);

      const payload = {
        ...postData,
        slug,
        excerpt,
        readTime,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : null
      };

      const url = edit ? `/api/blog/${edit}` : '/api/blog';
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Blog post ${status === 'published' ? 'published' : 'saved'} successfully!`);
        
        if (!edit) {
          router.push(`/admin/blog-builder?edit=${result.post.slug}`);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Failed to save post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    setPostData(prev => ({
      ...prev,
      content: template.content
    }));
    setShowTemplates(false);
    setSelectedTemplate(templateKey);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Simple frontmatter parsing
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
          const frontmatterText = match[1];
          const bodyContent = match[2];
          
          // Parse frontmatter
          const frontmatter = {};
          frontmatterText.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              const value = valueParts.join(':').trim().replace(/^[\"']|[\"']$/g, '');
              frontmatter[key.trim()] = value === 'true' ? true : value === 'false' ? false : value;
            }
          });
          
          setPostData(prev => ({
            ...prev,
            title: frontmatter.title || '',
            excerpt: frontmatter.excerpt || '',
            content: bodyContent.trim(),
            author: frontmatter.author || prev.author,
            authorEmail: frontmatter.authorEmail || prev.authorEmail,
            category: frontmatter.category || prev.category,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            featuredImage: frontmatter.featuredImage || '',
            featuredImageAlt: frontmatter.featuredImageAlt || '',
            seoTitle: frontmatter.seoTitle || '',
            seoDescription: frontmatter.seoDescription || ''
          }));
        } else {
          setPostData(prev => ({
            ...prev,
            content: content
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  const exportPost = () => {
    const frontmatter = `---
slug: '${postData.slug}'
title: '${postData.title}'
excerpt: >-
  ${postData.excerpt}
author: '${postData.author}'
authorEmail: '${postData.authorEmail}'
category: '${postData.category}'
tags:
${postData.tags.map(tag => `  - ${tag}`).join('\n')}
featuredImage: '${postData.featuredImage}'
featuredImageAlt: '${postData.featuredImageAlt}'
status: '${postData.status}'
featured: ${postData.featured}
publishedAt: '${postData.publishedAt || new Date().toISOString()}'
readTime: ${postData.readTime}
views: ${postData.views}
likes: ${postData.likes}
seoTitle: '${postData.seoTitle}'
seoDescription: '${postData.seoDescription}'
createdAt: '${new Date().toISOString()}'
updatedAt: '${new Date().toISOString()}'
---

${postData.content}`;

    const blob = new Blob([frontmatter], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generateSlug(postData.title) || 'blog-post'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumb}>
        <button 
          onClick={() => router.push('/admin')}
          className={styles.breadcrumbLink}
        >
          Admin
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <button 
          onClick={() => router.push('/admin/blog-dashboard')}
          className={styles.breadcrumbLink}
        >
          Blog Dashboard
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {edit ? 'Edit Post' : 'New Post'}
        </span>
      </div>

      <div className={styles.header}>
        <h1>📝 Blog Post Builder</h1>
        <p>{edit ? 'Edit existing blog post' : 'Create engaging blog content with ease'}</p>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <div className={styles.quickActions}>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={styles.secondaryButton}
          >
            📋 Templates
          </button>
          <label className={styles.secondaryButton}>
            📥 Import MD
            <input
              type="file"
              accept=".md"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
          <button
            onClick={exportPost}
            className={styles.secondaryButton}
            disabled={!postData.title}
          >
            📤 Export MD
          </button>
          <button
            onClick={() => router.push('/admin/blog-dashboard')}
            className={styles.secondaryButton}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => router.push('/admin')}
            className={styles.secondaryButton}
          >
            🏠 Admin Home
          </button>
        </div>

        {/* Templates */}
        {showTemplates && (
          <div className={styles.templatesSection}>
            <h3>📋 Post Templates</h3>
            <div className={styles.templatesGrid}>
              {Object.entries(templates).map(([key, template]) => (
                <div key={key} className={styles.templateCard}>
                  <h4>{template.name}</h4>
                  <button
                    onClick={() => applyTemplate(key)}
                    className={styles.button}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!showPreview ? (
        <div className={styles.form}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h2>📝 Post Information</h2>
            
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Post Title *</label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., How to Build Amazing Web Apps"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL Slug (auto-generated)</label>
                <input
                  type="text"
                  value={postData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={styles.input}
                  placeholder="url-friendly-slug"
                />
                <small className={styles.helpText}>
                  Auto-generated from title. Edit if needed.
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Excerpt</label>
                <textarea
                  value={postData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className={styles.textarea}
                  placeholder="Brief description (auto-generated if empty)"
                  rows={3}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Author *</label>
                  <input
                    type="text"
                    value={postData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={styles.input}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Author Email *</label>
                  <input
                    type="email"
                    value={postData.authorEmail}
                    onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                    className={styles.input}
                    placeholder="author@example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={postData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={styles.select}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <select
                    value={postData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={styles.select}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Read Time (minutes)</label>
                  <input
                    type="number"
                    value={postData.readTime}
                    onChange={(e) => handleInputChange('readTime', parseInt(e.target.value) || 0)}
                    className={styles.input}
                    min="1"
                    max="60"
                  />
                  <small className={styles.helpText}>Auto-calculated from content</small>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Publication Date</label>
                  <input
                    type="datetime-local"
                    value={postData.publishedAt ? new Date(postData.publishedAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('publishedAt', new Date(e.target.value).toISOString())}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Initial Views</label>
                  <input
                    type="number"
                    value={postData.views}
                    onChange={(e) => handleInputChange('views', parseInt(e.target.value) || 0)}
                    className={styles.input}
                    min="0"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Initial Likes</label>
                  <input
                    type="number"
                    value={postData.likes}
                    onChange={(e) => handleInputChange('likes', parseInt(e.target.value) || 0)}
                    className={styles.input}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tags</label>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className={styles.input}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className={styles.button}
                  >
                    Add
                  </button>
                </div>
                <div className={styles.tags}>
                  {postData.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className={styles.tagRemove}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.commonTags}>
                  <small className={styles.helpText}>Quick add common tags:</small>
                  <div className={styles.tagSuggestions}>
                    {commonTags.filter(tag => !postData.tags.includes(tag)).slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setPostData(prev => ({
                            ...prev,
                            tags: [...prev.tags, tag]
                          }));
                        }}
                        className={styles.tagSuggestion}
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Featured Image URL</label>
                  <input
                    type="url"
                    value={postData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Image Alt Text</label>
                  <input
                    type="text"
                    value={postData.featuredImageAlt}
                    onChange={(e) => handleInputChange('featuredImageAlt', e.target.value)}
                    className={styles.input}
                    placeholder="Describe the image"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={postData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className={styles.section}>
            <h2>🔍 SEO Optimization</h2>
            
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>SEO Title (60 chars max)</label>
                <input
                  type="text"
                  value={postData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className={styles.input}
                  placeholder="SEO optimized title"
                  maxLength={60}
                />
                <small className={styles.charCount}>
                  {postData.seoTitle.length}/60 characters
                </small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>SEO Description (160 chars max)</label>
                <textarea
                  value={postData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  className={styles.textarea}
                  placeholder="SEO meta description"
                  maxLength={160}
                  rows={3}
                />
                <small className={styles.charCount}>
                  {postData.seoDescription.length}/160 characters
                </small>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.section}>
            <h2>📄 Content</h2>
            
            <div className={styles.field}>
              <label className={styles.label}>Post Content (Markdown) *</label>
              <textarea
                value={postData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={styles.contentTextarea}
                placeholder="Write your blog post content in Markdown..."
                rows={20}
                required
              />
              <small className={styles.contentStats}>
                Words: {postData.content.split(/\s+/).filter(word => word.length > 0).length} | 
                Read time: ~{calculateReadTime(postData.content)} minutes
              </small>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={handlePreview}
              className={styles.secondaryButton}
              disabled={!postData.content || loading}
            >
              👁️ Preview
            </button>
            <button
              onClick={() => handleSave('draft')}
              className={styles.secondaryButton}
              disabled={loading}
            >
              💾 Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              className={styles.primaryButton}
              disabled={loading}
            >
              🚀 Publish Post
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <h3>👁️ Post Preview</h3>
            <div className={styles.previewActions}>
              <button
                onClick={() => setShowPreview(false)}
                className={styles.secondaryButton}
              >
                ← Back to Editor
              </button>
              <button
                onClick={() => handleSave('draft')}
                className={styles.secondaryButton}
                disabled={loading}
              >
                💾 Save Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                className={styles.primaryButton}
                disabled={loading}
              >
                🚀 Publish Post
              </button>
            </div>
          </div>

          <div className={styles.previewContent}>
            <div className={styles.previewMeta}>
              <h1>{postData.title}</h1>
              <div className={styles.previewMetaInfo}>
                <span>By {postData.author}</span>
                <span>•</span>
                <span>{postData.category}</span>
                <span>•</span>
                <span>~{calculateReadTime(postData.content)} min read</span>
              </div>
              {postData.tags.length > 0 && (
                <div className={styles.previewTags}>
                  {postData.tags.map(tag => (
                    <span key={tag} className={styles.previewTag}>#{tag}</span>
                  ))}
                </div>
              )}
              {postData.excerpt && (
                <p className={styles.previewExcerpt}>{postData.excerpt}</p>
              )}
            </div>
            <div 
              className={styles.previewBody}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
