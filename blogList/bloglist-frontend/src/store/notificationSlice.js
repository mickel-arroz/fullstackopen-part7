import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: null, type: null, timeoutId: null };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const { message, type, timeoutId } = action.payload;
      state.message = message;
      state.type = type;
      state.timeoutId = timeoutId;
    },
    clearNotification(state) {
      state.message = null;
      state.type = null;
      state.timeoutId = null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

// Thunk to show notification and auto-clear after timeout (clears previous timeout)
export const showNotification =
  (message, type = 'info', timeout = 5000) =>
  (dispatch, getState) => {
    const prevTimeout = getState().notification.timeoutId;
    if (prevTimeout) {
      clearTimeout(prevTimeout);
    }

    const timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, timeout);

    dispatch(setNotification({ message, type, timeoutId }));
  };

export default notificationSlice.reducer;
