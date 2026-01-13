import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import blogsReducer from './blogsSlice';
import authReducer from './authSlice';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    auth: authReducer,
    users: usersReducer,
  },
});

export default store;
