import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/blog.css';

const Blog = ({ blog }) => {
  const containerStyle = {
    border: '1px solid #ddd',
    borderRadius: 6,
    padding: '0.75rem',
    marginBottom: '0.75rem',
    background: '#ffffff',
  };

  const titleRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    fontWeight: 600,
  };

  return (
    <div className="blog" style={containerStyle}>
      <div style={titleRowStyle}>
        <span>
          <Link className="blog-link" to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>{' '}
          <span style={{ fontWeight: 400, color: '#555', fontStyle: 'italic' }}>
            by {blog.author}
          </span>
        </span>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default Blog;
