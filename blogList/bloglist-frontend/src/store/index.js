import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import blogsReducer from './blogsSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    auth: authReducer,
  },
});

export default store;
