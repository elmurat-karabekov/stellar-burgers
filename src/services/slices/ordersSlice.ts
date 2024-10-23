import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';

type TOrdersState = {
  order: TOrder | null;
  isOrderLoading: boolean;
  orderModal: TOrder | null;
  isOrderRequested: boolean;
  profileOrders: TOrder[];
  isProfileOrdersLoading: boolean;
  errors: string | null;
};

const initialState: TOrdersState = {
  order: null,
  isOrderLoading: false,
  orderModal: null,
  isOrderRequested: false,
  profileOrders: [],
  isProfileOrdersLoading: false,
  errors: null
};

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    const order = response.orders[0];
    return order;
  }
);

export const getProfileOrders = createAsyncThunk(
  'orders/getProfileOrders',
  async () => await getOrdersApi()
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModal: (state) => {
      state.orderModal = null;
    }
  },
  selectors: {
    selectOrder: (state) => state.order,
    isOrderLoading: (state) => state.isOrderLoading,
    selectProfileOrders: (state) => state.profileOrders,
    selectOrderModal: (state) => state.orderModal,
    isOrderRequested: (state) => state.isOrderRequested
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.errors = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errors = action.error.message ?? null;
      })
      .addCase(getProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
        state.errors = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.errors = action.error.message || null;
      })
      .addCase(orderBurger.pending, (state) => {
        state.isOrderRequested = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isOrderRequested = false;
        state.orderModal = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isOrderRequested = false;
      });
  }
});

export const { resetOrderModal } = ordersSlice.actions;
export const {
  selectOrder,
  isOrderLoading,
  selectProfileOrders,
  selectOrderModal,
  isOrderRequested
} = ordersSlice.selectors;
