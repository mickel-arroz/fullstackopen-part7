import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const newBlog = await blogService.create(blogData);
      return newBlog;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, updatedBlog }, { rejectWithValue }) => {
    try {
      const updated = await blogService.update(id, updatedBlog);
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeBlog = createAsyncThunk(
  'blogs/removeBlog',
  async (id, { rejectWithValue }) => {
    try {
      await blogService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((b) =>
          b.id === updated.id ? updated : b
        );
      })
      .addCase(removeBlog.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((b) => b.id !== id);
      });
  },
});

export default blogsSlice.reducer;
