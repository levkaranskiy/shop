import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types';
import * as productsApi from '../api/products.api';

interface ProductsState {
  products: Product[];
  categories: string[];
  currentProduct: Product | null;
  total: number;
  loading: boolean;
  filters: ProductFilters;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  currentProduct: null,
  total: 0,
  loading: false,
  filters: {},
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      return await productsApi.getProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки товаров');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productsApi.getCategories();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      return await productsApi.getProduct(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки товара');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: CreateProductDto, { rejectWithValue }) => {
    try {
      return await productsApi.createProduct(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания товара');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: UpdateProductDto }, { rejectWithValue }) => {
    try {
      return await productsApi.updateProduct(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления товара');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsApi.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления товара');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
