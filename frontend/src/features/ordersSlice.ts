import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Order } from '../types';
import * as ordersApi from '../api/orders.api';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersApi.getOrders();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заказов');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (address: string, { rejectWithValue }) => {
    try {
      return await ordersApi.createOrder(address);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ordersSlice.reducer;
