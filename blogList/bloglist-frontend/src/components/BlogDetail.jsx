import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import blogService from '../services/blogs';
import {
  updateBlog as updateBlogThunk,
  removeBlog as removeBlogThunk,
} from '../store/blogsSlice';
import { showNotification } from '../store/notificationSlice';
import '../styles/blog.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    blogService
      .getById(id)
      .then((b) => {
        if (mounted) setBlog(b);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Error loading blog');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentText || commentText.trim() === '') return;

    try {
      const updated = await blogService.addComment(blog.id, commentText.trim());
      setBlog(updated);
      setCommentText('');
      dispatch(showNotification('Comment added', 'success'));
    } catch (err) {
      console.error(err);
      dispatch(showNotification('Error adding comment', 'error'));
    }
  };

  const handleDeleteComment = async (index) => {
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) return;
    try {
      const updated = await blogService.deleteComment(blog.id, index);
      setBlog(updated);
      dispatch(showNotification('Comment deleted', 'success'));
    } catch (err) {
      console.error(err);
      dispatch(showNotification('Error deleting comment', 'error'));
    }
  };

  if (loading) return <div>Loading blog...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Blog not found</div>;

  const handleLike = async () => {
    try {
      const updated = { ...blog, likes: (blog.likes ?? 0) + 1 };
      await dispatch(
        updateBlogThunk({ id: blog.id, updatedBlog: updated })
      ).unwrap();
      setBlog(updated);
      dispatch(showNotification(`Liked blog: "${updated.title}"`, 'success'));
    } catch (err) {
      console.error(err);
      dispatch(showNotification('Error updating blog', 'error'));
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this blog?'
    );
    if (!confirmed) return;
    try {
      await dispatch(removeBlogThunk(blog.id)).unwrap();
      dispatch(showNotification('Blog deleted', 'success'));
      navigate('/');
    } catch (err) {
      console.error(err);
      dispatch(showNotification('Error deleting blog', 'error'));
    }
  };

  return (
    <div className="blog-detail">
      <h2>{blog.title}</h2>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>
        <strong>URL:</strong>{' '}
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        <strong>Likes:</strong> {blog.likes ?? 0}{' '}
        <button onClick={handleLike}>like</button>
      </p>
      <p>
        <strong>Added by:</strong> {blog.user?.name ?? 'unknown'}
      </p>
      <button onClick={handleDelete}>DELETE</button>

      <h3>Comments</h3>
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          id="comment"
          type="text"
          value={commentText}
          onChange={({ target }) => setCommentText(target.value)}
          aria-label="Add comment"
        />
        <button
          type="submit"
          disabled={!commentText || commentText.trim() === ''}
        >
          add comment
        </button>
      </form>

      <ul className="comments-list">
        {blog.comments && blog.comments.length > 0 ? (
          blog.comments.map((c, i) => (
            <li key={i} className="comment-item">
              <span className="comment-text">{c}</span>
              <button
                className="comment-delete"
                onClick={() => handleDeleteComment(i)}
                aria-label={`Delete comment ${i}`}
              >
                ×
              </button>
            </li>
          ))
        ) : (
          <li className="empty">No comments</li>
        )}
      </ul>
    </div>
  );
};

export default BlogDetail;
