import Link from 'next/link';
import styles from '../styles/HomeBlog.module.css';
import BlogService from '../services/BlogService';

export default function Home({ featuredPost, recentPosts }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.page}>
      {featuredPost && (
        <section>
          <h2 className={styles.sectionTitle}>Featured Blog</h2>
          <article className={styles.featured}>
            <div className={styles.featuredThumb}>
              {featuredPost.featuredImage && (
                <img 
                  src={featuredPost.featuredImage} 
                  alt={featuredPost.featuredImageAlt || featuredPost.title}
                  className={styles.featuredImage}
                />
              )}
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
              <div className={styles.featuredMeta}>
                {formatDate(featuredPost.publishedAt)} • {featuredPost.readTime} min read • By {featuredPost.author}
              </div>
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              <div className={styles.featuredTags}>
                {featuredPost.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Link href={`/blog/${featuredPost.slug}`} className={styles.readMore}>
                  Read full article →
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {recentPosts && recentPosts.length > 0 && (
        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Latest Posts</h2>
          <div className={styles.list}>
            {recentPosts.map((post) => (
              <article key={post.slug} className={styles.item}>
                <div className={styles.itemThumb}>
                  {post.featuredImage && (
                    <img 
                      src={post.featuredImage} 
                      alt={post.featuredImageAlt || post.title}
                      className={styles.itemImage}
                    />
                  )}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemCategory}>{post.category}</div>
                  <h4 className={styles.itemTitle}>{post.title}</h4>
                  <div className={styles.itemMeta}>
                    {formatDate(post.publishedAt)} • {post.readTime} min read
                  </div>
                  <p className={styles.itemExcerpt}>{post.excerpt}</p>
                  <div className={styles.itemStats}>
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Read →
                </Link>
              </article>
            ))}
          </div>
          
          <div className={styles.viewAllSection}>
            <Link href="/blog" className={styles.viewAllButton}>
              View All Blog Posts →
            </Link>
          </div>
        </section>
      )}

      {(!recentPosts || recentPosts.length === 0) && (
        <section className={styles.emptyState}>
          <h2>No Blog Posts Yet</h2>
          <p>Check back soon for amazing content and tutorials!</p>
        </section>
      )}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const blogService = new BlogService();
    
    // Get featured posts (first one will be the featured post)
    const featuredPosts = await blogService.getFeaturedPosts(1);
    const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : null;
    
    // Get recent published posts (excluding the featured one)
    const recentPostsResult = await blogService.getRecentPosts(6);
    let recentPosts = recentPostsResult || [];
    
    // If we have a featured post, exclude it from recent posts
    if (featuredPost) {
      recentPosts = recentPosts.filter(post => post.slug !== featuredPost.slug);
    }
    
    // Limit to 5 recent posts
    recentPosts = recentPosts.slice(0, 5);
    
    // Convert to plain objects for serialization
    const serializedFeaturedPost = featuredPost ? {
      id: featuredPost.id,
      slug: featuredPost.slug,
      title: featuredPost.title,
      excerpt: featuredPost.excerpt,
      author: featuredPost.author,
      category: featuredPost.category,
      tags: featuredPost.tags,
      featuredImage: featuredPost.featuredImage,
      featuredImageAlt: featuredPost.featuredImageAlt,
      publishedAt: featuredPost.publishedAt,
      readTime: featuredPost.readTime,
      views: featuredPost.views,
      likes: featuredPost.likes
    } : null;
    
    const serializedRecentPosts = recentPosts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      featuredImageAlt: post.featuredImageAlt,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views,
      likes: post.likes
    }));
    
    return {
      props: {
        featuredPost: serializedFeaturedPost,
        recentPosts: serializedRecentPosts,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching blog posts for home page:', error);
    
    return {
      props: {
        featuredPost: null,
        recentPosts: [],
      },
      revalidate: 60, // Try again in 1 minute if there was an error
    };
  }
}
