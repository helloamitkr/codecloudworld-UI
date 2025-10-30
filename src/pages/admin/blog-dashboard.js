import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function BlogDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    author: '',
    featured: ''
  });
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load statistics
      const statsResponse = await fetch('/api/blog/stats');
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
      setCategories(statsData.categories || []);
      setAuthors(statsData.authors || []);

      // Load blog posts
      const postsResponse = await fetch('/api/blog');
      const postsData = await postsResponse.json();
      setPosts(postsData.posts || []);

      setError(null);
    } catch (err) {
      console.error('Error loading blog dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDashboardData();
      return;
    }

    try {
      const response = await fetch(`/api/blog?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error searching blog posts:', err);
      setError('Search failed');
    }
  };

  const handleFilterChange = async (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);

    try {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });

      const response = await fetch(`/api/blog?${params.toString()}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error filtering blog posts:', err);
      setError('Filter failed');
    }
  };

  const handlePostAction = async (postSlug, action) => {
    try {
      const response = await fetch(`/api/blog/actions/${postSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        loadDashboardData();
        alert(`Post ${action}ed successfully`);
      } else {
        throw new Error(`${action} failed`);
      }
    } catch (err) {
      console.error(`Error ${action}ing post:`, err);
      alert(`Failed to ${action} post`);
    }
  };

  const deletePost = async (postSlug) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${postSlug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadDashboardData();
        alert('Blog post deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('Failed to delete blog post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading blog dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={loadDashboardData} className={styles.button}>
          Retry
        </button>
      </div>
    );
  }

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
        <span className={styles.breadcrumbCurrent}>Blog Dashboard</span>
      </div>

      <div className={styles.header}>
        <h1>📝 Blog Management Dashboard</h1>
        <p>Manage your blog posts, analytics, and content strategy</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>📚 Total Posts</h3>
            <div className={styles.statNumber}>{stats.totalPosts}</div>
          </div>
          <div className={styles.statCard}>
            <h3>✅ Published</h3>
            <div className={styles.statNumber}>{stats.publishedPosts}</div>
          </div>
          <div className={styles.statCard}>
            <h3>📝 Drafts</h3>
            <div className={styles.statNumber}>{stats.draftPosts}</div>
          </div>
          <div className={styles.statCard}>
            <h3>⭐ Featured</h3>
            <div className={styles.statNumber}>{stats.featuredPosts}</div>
          </div>
          <div className={styles.statCard}>
            <h3>👁️ Total Views</h3>
            <div className={styles.statNumber}>{stats.totalViews}</div>
          </div>
          <div className={styles.statCard}>
            <h3>❤️ Total Likes</h3>
            <div className={styles.statNumber}>{stats.totalLikes}</div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {stats && (
        <div className={styles.section}>
          <h2>📊 Content Analytics</h2>
          <div className={styles.distributionGrid}>
            <div className={styles.distributionCard}>
              <h4>📂 Posts by Category</h4>
              <div className={styles.distributionStats}>
                {Object.entries(stats.postsByCategory).map(([category, count]) => (
                  <div key={category}>
                    <span>{category}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.distributionCard}>
              <h4>✍️ Posts by Author</h4>
              <div className={styles.distributionStats}>
                {Object.entries(stats.postsByAuthor).map(([author, count]) => (
                  <div key={author}>
                    <span>{author}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.distributionCard}>
              <h4>🏷️ Popular Tags</h4>
              <div className={styles.distributionStats}>
                {Object.entries(stats.popularTags).slice(0, 8).map(([tag, count]) => (
                  <div key={tag}>
                    <span>#{tag}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.distributionCard}>
              <h4>📈 Recent Activity</h4>
              <div className={styles.recentPosts}>
                {stats.recentPosts.map((post) => (
                  <div key={post.id} className={styles.recentPost}>
                    <div className={styles.recentPostTitle}>{post.title}</div>
                    <div className={styles.recentPostDate}>
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className={styles.section}>
        <h2>🔍 Search & Filter Posts</h2>
        <div className={styles.searchFilters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className={styles.button}>
              Search
            </button>
          </div>
          
          <div className={styles.filters}>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={styles.select}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              className={styles.select}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name} ({author.count})
                </option>
              ))}
            </select>

            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className={styles.select}
            >
              <option value="">All Posts</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Management */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>📋 Blog Posts Management</h2>
          <button
            onClick={() => router.push('/admin/blog-builder')}
            className={styles.primaryButton}
          >
            ➕ Create New Post
          </button>
        </div>

        <div className={styles.courseTable}>
          <div className={styles.blogTableHeader}>
            <div>Post</div>
            <div>Author</div>
            <div>Status</div>
            <div>Category</div>
            <div>Views</div>
            <div>Likes</div>
            <div>Published</div>
            <div>Actions</div>
          </div>

          {posts.map((post) => (
            <div key={post.id} className={styles.tableRow}>
              <div className={styles.courseInfo}>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className={styles.postTags}>
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                  {post.featured && <span className={styles.featured}>⭐ Featured</span>}
                </div>
                <div className={styles.postMeta}>
                  📖 {post.readTime} min read
                </div>
              </div>
              
              <div className={styles.author}>
                {post.author}
              </div>
              
              <div className={`${styles.status} ${styles[post.status]}`}>
                {post.status}
              </div>
              
              <div className={styles.category}>
                {post.category}
              </div>
              
              <div className={styles.views}>
                👁️ {post.views}
              </div>
              
              <div className={styles.likes}>
                ❤️ {post.likes}
              </div>
              
              <div className={styles.publishDate}>
                {post.publishedAt ? formatDate(post.publishedAt) : '-'}
              </div>
              
              <div className={styles.actions}>
                <button
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className={styles.viewButton}
                  title="View Post"
                >
                  👁️
                </button>
                <button
                  onClick={() => router.push(`/admin/blog-builder?edit=${post.slug}`)}
                  className={styles.editButton}
                  title="Edit Post"
                >
                  ✏️
                </button>
                {post.status === 'draft' && (
                  <button
                    onClick={() => handlePostAction(post.slug, 'publish')}
                    className={styles.publishButton}
                    title="Publish Post"
                  >
                    🚀
                  </button>
                )}
                {post.status === 'published' && (
                  <button
                    onClick={() => handlePostAction(post.slug, 'unpublish')}
                    className={styles.unpublishButton}
                    title="Unpublish Post"
                  >
                    📥
                  </button>
                )}
                <button
                  onClick={() => deletePost(post.slug)}
                  className={styles.deleteButton}
                  title="Delete Post"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className={styles.emptyState}>
              <p>No blog posts found</p>
              <button
                onClick={() => router.push('/admin/blog-builder')}
                className={styles.primaryButton}
              >
                Create Your First Blog Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2>⚡ Quick Actions</h2>
        <div className={styles.quickActions}>
          <button
            onClick={() => router.push('/admin/blog-builder')}
            className={styles.actionButton}
          >
            📝 New Post
          </button>
          <button
            onClick={() => router.push('/blog')}
            className={styles.actionButton}
          >
            🌐 View Blog
          </button>
          <button
            onClick={() => router.push('/admin')}
            className={styles.actionButton}
          >
            🏠 Admin Home
          </button>
          <button
            onClick={loadDashboardData}
            className={styles.actionButton}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
