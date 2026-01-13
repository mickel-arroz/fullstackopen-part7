// Generic notification component. Uses Notification Context to read message and type.
// type can be: 'error' | 'success' | 'info'

import { useSelector } from 'react-redux';
import '../styles/notification.css';

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification || {});

  if (!message) return null;

  return (
    <div id="notification" className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
