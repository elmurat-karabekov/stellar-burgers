import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '@api';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  loadingError: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  loadingError: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    isIngredientsLoading: (state) => state.isLoading,
    loadingError: (state) => state.loadingError
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.loadingError = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingError = action.error.message || null;
      });
  }
});

export const { selectIngredients, isIngredientsLoading, loadingError } =
  ingredientsSlice.selectors;
