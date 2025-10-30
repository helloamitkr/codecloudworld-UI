import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function ModelDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    level: '',
    tag: '',
    featured: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load statistics
      const statsResponse = await fetch('/api/courses/model/stats');
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Load courses
      const coursesResponse = await fetch('/api/courses/model');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses || []);

      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
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
      const response = await fetch(`/api/courses/model?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Error searching courses:', err);
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

      const response = await fetch(`/api/courses/model?${params.toString()}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Error filtering courses:', err);
      setError('Filter failed');
    }
  };

  const deleteCourse = async (courseSlug) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/model/${courseSlug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadDashboardData();
        alert('Course deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading dashboard...</div>
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
      <div className={styles.header}>
        <h1>📊 Model-Based Course Dashboard</h1>
        <p>Advanced course management with validation and statistics</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>📚 Total Courses</h3>
            <div className={styles.statNumber}>{stats.totalCourses}</div>
          </div>
          <div className={styles.statCard}>
            <h3>✅ Published</h3>
            <div className={styles.statNumber}>{stats.publishedCourses}</div>
          </div>
          <div className={styles.statCard}>
            <h3>📝 Drafts</h3>
            <div className={styles.statNumber}>{stats.draftCourses}</div>
          </div>
          <div className={styles.statCard}>
            <h3>⭐ Featured</h3>
            <div className={styles.statNumber}>{stats.featuredCourses}</div>
          </div>
          <div className={styles.statCard}>
            <h3>📖 Total Lessons</h3>
            <div className={styles.statNumber}>{stats.totalLessons}</div>
          </div>
        </div>
      )}

      {/* Level Distribution */}
      {stats && (
        <div className={styles.section}>
          <h2>📊 Course Distribution</h2>
          <div className={styles.distributionGrid}>
            <div className={styles.distributionCard}>
              <h4>By Level</h4>
              <div className={styles.distributionStats}>
                <div>Beginner: {stats.coursesByLevel.beginner}</div>
                <div>Intermediate: {stats.coursesByLevel.intermediate}</div>
                <div>Advanced: {stats.coursesByLevel.advanced}</div>
              </div>
            </div>
            <div className={styles.distributionCard}>
              <h4>By Technology</h4>
              <div className={styles.distributionStats}>
                {Object.entries(stats.coursesByTag).map(([tag, count]) => (
                  <div key={tag}>{tag}: {count}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className={styles.section}>
        <h2>🔍 Search & Filter Courses</h2>
        <div className={styles.searchFilters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search courses..."
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
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className={styles.select}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className={styles.select}
            >
              <option value="">All Courses</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>📋 Course Management</h2>
          <button
            onClick={() => router.push('/admin/course-builder')}
            className={styles.primaryButton}
          >
            ➕ Create New Course
          </button>
        </div>

        <div className={styles.courseTable}>
          <div className={styles.tableHeader}>
            <div>Course</div>
            <div>Status</div>
            <div>Level</div>
            <div>Lessons</div>
            <div>Updated</div>
            <div>Actions</div>
          </div>

          {courses.map((course) => (
            <div key={course.id} className={styles.tableRow}>
              <div className={styles.courseInfo}>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <span className={styles.tag}>{course.tag}</span>
                {course.featured && <span className={styles.featured}>⭐ Featured</span>}
              </div>
              
              <div className={`${styles.status} ${styles[course.status]}`}>
                {course.status}
              </div>
              
              <div className={styles.level}>
                {course.level}
              </div>
              
              <div className={styles.lessonCount}>
                {course.stats?.totalLessons || 0}
              </div>
              
              <div className={styles.updated}>
                {new Date(course.updatedAt).toLocaleDateString()}
              </div>
              
              <div className={styles.actions}>
                <button
                  onClick={() => router.push(`/courses/${course.slug}`)}
                  className={styles.viewButton}
                  title="View Course"
                >
                  👁️
                </button>
                <button
                  onClick={() => router.push(`/admin/course-builder?edit=${course.slug}`)}
                  className={styles.editButton}
                  title="Edit Course"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteCourse(course.slug)}
                  className={styles.deleteButton}
                  title="Delete Course"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className={styles.emptyState}>
              <p>No courses found</p>
              <button
                onClick={() => router.push('/admin/course-builder')}
                className={styles.primaryButton}
              >
                Create Your First Course
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
            onClick={() => router.push('/admin/course-builder')}
            className={styles.actionButton}
          >
            📝 Create Course
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
