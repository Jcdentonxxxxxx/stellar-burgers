import type { RootState } from '../store';

export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const getIsIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;

export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;
