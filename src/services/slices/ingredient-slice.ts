import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface IngredientState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
}

const initialState: IngredientState = {
  ingredients: [],
  isIngredientsLoading: true,
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = '';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        const err = action.error;
        if (err instanceof Error) {
          state.error = err.message;
        } else if (err && typeof err === 'object') {
          const message = (err as any).message || (err as any).error;
          state.error = message ? String(message) : 'Ошибка загрузки';
        } else {
          state.error = 'Ошибка загрузки ингредиентов';
        }
      });
  }
});
