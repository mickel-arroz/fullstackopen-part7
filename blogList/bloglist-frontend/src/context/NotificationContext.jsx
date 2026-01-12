import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NotificationContext } from './notificationContext';

export const NotificationProvider = ({ children }) => {
  const [notification, setNotificationState] = useState({
    message: null,
    type: null,
  });
  const timeoutRef = useRef();

  const setNotification = (message, type = 'info', timeout = 5000) => {
    setNotificationState({ message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotificationState({ message: null, type: null });
      timeoutRef.current = undefined;
    }, timeout);
  };

  const clearNotification = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setNotificationState({ message: null, type: null });
    timeoutRef.current = undefined;
  };

  return (
    <NotificationContext.Provider
      value={{ ...notification, setNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
