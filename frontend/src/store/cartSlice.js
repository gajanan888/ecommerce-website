import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cartAPI } from '../services/api';

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const handleCartResponse = (cart) => cart || { items: [] };

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.get();
      return handleCartResponse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch cart'
      );
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.add({ productId, quantity });
      return handleCartResponse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to add item'
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.remove(productId);
      return handleCartResponse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to remove item'
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.update(productId, { quantity });
      return handleCartResponse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update item'
      );
    }
  }
);

export const clearCartItems = createAsyncThunk(
  'cart/clearCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clear();
      return handleCartResponse(response.data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to clear cart'
      );
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
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
