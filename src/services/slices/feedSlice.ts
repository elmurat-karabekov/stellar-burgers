import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '../../utils/types';

type TFeedState = {
  data: TOrdersData;
  isLoading: boolean;
  loadingError: string | null;
};

const initialState: TFeedState = {
  data: {
    orders: [],
    total: NaN,
    totalToday: NaN
  },
  isLoading: false,
  loadingError: null
};

export const loadFeed = createAsyncThunk(
  'feeds/loadFeed',
  async () => await getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedData: (state) => state.data,
    selectFeedOrders: (state) => state.data.orders,
    isFeedLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.isLoading = true;
        state.loadingError = null;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingError = action.error.message || null;
      });
  }
});

export const { selectFeedData, selectFeedOrders, isFeedLoading } =
  feedSlice.selectors;
