import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { showNotification } from '../store/notificationSlice';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showNotification('Logged out', 'info'));
  };

  return (
    <nav className="app-nav">
      <Link className="nav-link" to="/">
        home
      </Link>
      <Link className="nav-link" to="/users">
        users
      </Link>
      <div className="spacer" />
      {user ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
            {user.name}
          </span>
          <button type="button" onClick={handleLogout}>
            logout
          </button>
        </div>
      ) : (
        <Link className="nav-link" to="/login">
          login
        </Link>
      )}
    </nav>
  );
};

export default Header;
