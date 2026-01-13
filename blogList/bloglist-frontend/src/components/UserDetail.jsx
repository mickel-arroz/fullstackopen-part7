import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usersService from '../services/users';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    usersService
      .getById(id)
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Error loading user');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="users-card">
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      {user.blogs && user.blogs.length > 0 ? (
        <ul>
          {user.blogs.map((b) => (
            <li key={b.id}>{b.title}</li>
          ))}
        </ul>
      ) : (
        <p>No blogs</p>
      )}
    </div>
  );
};

export default UserDetail;
