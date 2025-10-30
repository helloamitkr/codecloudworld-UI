import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import SubscribeForm from '../../components/SubscribeForm';
import BlogService from '../../services/BlogService';

export default function BlogPost({ post, relatedPosts }) {
  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className={styles.backLink}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <header className={styles.postHeader}>
          <div className={styles.postMeta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{formatDate(post.publishedAt)}</span>
            <span className={styles.readTime}>{post.readTime} min read</span>
          </div>
          
          <h1 className={styles.postTitle}>{post.title}</h1>
          
          <div className={styles.authorInfo}>
            <span>By {post.author}</span>
            <div className={styles.postStats}>
              <span>👁️ {post.views} views</span>
              <span>❤️ {post.likes} likes</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className={styles.featuredImage}>
              <img 
                src={post.featuredImage} 
                alt={post.featuredImageAlt || post.title}
              />
            </div>
          )}

          {post.excerpt && (
            <p className={styles.excerpt}>{post.excerpt}</p>
          )}

          <div className={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        </header>

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className={styles.relatedPosts}>
          <h3>Related Posts</h3>
          <div className={styles.relatedGrid}>
            {relatedPosts.map(relatedPost => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className={styles.relatedCard}>
                <h4>{relatedPost.title}</h4>
                <p>{relatedPost.excerpt}</p>
                <div className={styles.relatedMeta}>
                  {formatDate(relatedPost.publishedAt)} • {relatedPost.readTime} min read
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.subscribeBox}>
        <h3>Get new posts in your inbox</h3>
        <p>Subscribe to stay updated with our latest blog posts and tutorials.</p>
        <SubscribeForm />
      </div>

      <div className={styles.navigation}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const blogService = new BlogService();
    const { posts } = await blogService.getAllPosts({ status: 'published' });
    
    const paths = posts.map(post => ({
      params: { slug: post.slug }
    }));

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new posts
    };
  } catch (error) {
    console.error('Error generating blog post paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const blogService = new BlogService();
    
    // Get the blog post
    const post = await blogService.getPostBySlug(params.slug);
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    // Get related posts
    const relatedPosts = await blogService.getRelatedPosts(params.slug, 3);
    
    // Increment view count (this will be done server-side)
    await blogService.incrementViews(params.slug);
    
    // Serialize the data
    const serializedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      contentHtml: post.contentHtml,
      author: post.author,
      authorEmail: post.authorEmail,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      featuredImageAlt: post.featuredImageAlt,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views + 1, // Include the incremented view
      likes: post.likes,
      status: post.status,
      featured: post.featured
    };

    const serializedRelatedPosts = relatedPosts.map(relatedPost => ({
      id: relatedPost.id,
      slug: relatedPost.slug,
      title: relatedPost.title,
      excerpt: relatedPost.excerpt,
      author: relatedPost.author,
      category: relatedPost.category,
      publishedAt: relatedPost.publishedAt,
      readTime: relatedPost.readTime
    }));

    return {
      props: {
        post: serializedPost,
        relatedPosts: serializedRelatedPosts,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
    };
  }
}
