import { createContext, useContext } from 'react';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

// Re-export provider to avoid module resolution ambiguity between
// NotificationContext.jsx and notificationContext.js on case-insensitive filesystems
export { NotificationProvider } from './NotificationContext.jsx';
