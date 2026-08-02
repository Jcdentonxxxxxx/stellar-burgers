import { ingredientsMock } from '../../../mocks/ingredients';
import * as api from '@api';

import {
  initialState,
  fetchIngredients,
  ingredientsSlice
} from '../ingredient-slice';

import store from '@store';

import { expect, test, describe, jest, afterEach } from '@jest/globals';

describe('тест асинхронных экшенов', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('тест ожидания загрузки ингредиентов', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockImplementation(() => new Promise(() => {}));

    store.dispatch(fetchIngredients());
    const { ingredients, isIngredientsLoading, error } =
      store.getState().ingredients;

    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
    expect(ingredients).toEqual(initialState.ingredients);
    expect(isIngredientsLoading).toBe(true);
    expect(error).toBe('');

    getIngredientsSpy.mockRestore();
  });

  test('тест загрузки ингредиентов', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockImplementation(() => Promise.resolve(ingredientsMock));

    await store.dispatch(fetchIngredients());

    const { ingredients } = store.getState().ingredients;

    expect(ingredients).toEqual(ingredientsMock);
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });

  test('тест reject', async () => {
    jest
      .spyOn(api, 'getIngredientsApi')
      .mockImplementation(() =>
        Promise.reject(new Error('get ingredients error'))
      );
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('get ingredients error');
  });

  test('неизвестный экшен', async () => {
    const state = ingredientsSlice.getInitialState();
    const possibleState = ingredientsSlice.reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(possibleState).toEqual(state);
  });
});
