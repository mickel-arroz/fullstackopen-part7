import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import { showNotification } from './store/notificationSlice';
import { logout, login, initializeUser } from './store/authSlice';
import {
  fetchBlogs,
  createBlog as createBlogThunk,
  updateBlog as updateBlogThunk,
  removeBlog as removeBlogThunk,
} from './store/blogsSlice';
const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((state) => state.auth.user);

  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const setNotification = (message, type = 'info', timeout = 5000) => {
    dispatch(showNotification(message, type, timeout));
  };

  const blogs = useSelector((state) => state.blogs.items ?? []);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userResult = await dispatch(login({ username, password })).unwrap();
      setUsername('');
      setPassword('');
      setNotification(`${userResult.name} logged in`, 'success');
    } catch (exception) {
      setNotification('Wrong credentials', 'error');
      console.error(exception);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setNotification('Logged out', 'info');
  };

  const createBlog = async (blogData) => {
    blogFormRef.current.toggleVisibility();
    try {
      await dispatch(createBlogThunk(blogData)).unwrap();
      setNotification(
        `A new blog was created: "${blogData.title}" by ${blogData.author}`,
        'success'
      );
    } catch (error) {
      console.error(error);
      setNotification('Error creating blog', 'error');
    }
  };

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: (blog.likes ?? 0) + 1 };
      await dispatch(updateBlogThunk({ id: blog.id, updatedBlog })).unwrap();
      setNotification(
        `Liked blog: "${updatedBlog.title}" by ${updatedBlog.author}`,
        'success'
      );
    } catch (error) {
      console.error(error);
      setNotification('Error updating blog', 'error');
    }
  };

  const deleteBlog = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this blog?'
    );
    if (!confirmed) return;
    try {
      await dispatch(removeBlogThunk(id)).unwrap();
      setNotification('Blog deleted', 'success');
    } catch (error) {
      console.error(error);
      setNotification('Error deleting blog', 'error');
    }
  };

  const loginForm = () => (
    <LoginForm
      onSubmit={handleLogin}
      username={username}
      password={password}
      onUsernameChange={({ target }) => setUsername(target.value)}
      onPasswordChange={({ target }) => setPassword(target.value)}
    />
  );

  return (
    <div>
      <h1>Blog List</h1>
      <Notification />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>Create Blog</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <h2>blogs</h2>
          {blogs
            .slice()
            .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                onLike={() => likeBlog(blog)}
                onDelete={() => deleteBlog(blog.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
