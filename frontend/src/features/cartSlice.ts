import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CartItem } from '../types';
import * as cartApi from '../api/cart.api';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.getCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки корзины');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartApi.addToCart(productId, quantity);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления в корзину');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartApi.updateCartItem(id, quantity);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления корзины');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await cartApi.removeCartItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления из корзины');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка очистки корзины');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
        if (existingIndex !== -1) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
