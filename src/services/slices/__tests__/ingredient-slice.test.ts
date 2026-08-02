import { ingredientsMock } from '../../../mocks/ingredients';
import * as api from '@api';

import { fetchIngredients, ingredientsSlice } from '../ingredient-slice';

import {
  getIngredients,
  getIsIngredientsLoading,
  getIngredientsError
} from '@selectors';

import store from '@store';

import { expect, test, describe, jest, afterEach } from '@jest/globals';

describe('тесты слайса ingredientsSlice', () => {
  const initialState = ingredientsSlice.getInitialState();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('тест асинхронных экшенов', () => {
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
  });

  describe('тесты синхронных экшенов', () => {
    test('неизвестный экшен', () => {
      const state = ingredientsSlice.getInitialState();
      const possibleState = ingredientsSlice.reducer(undefined, {
        type: 'UNKNOWN'
      });

      expect(possibleState).toEqual(state);
    });
  });

  describe('тесты селекторов', () => {
    test('получение ингредиентов через селектор', () => {
      const state = {
        ...store.getState(),
        ingredients: {
          ...initialState,
          ingredients: ingredientsMock,
          isIngredientsLoading: true,
          error: ''
        }
      };

      const ingredients = getIngredients(state);
      expect(ingredients).toEqual(ingredientsMock);
    });

    test('получение статуса загрузки через селектор', () => {
      const state = {
        ...store.getState(),
        ingredients: {
          ...initialState,
          ingredients: ingredientsMock,
          isIngredientsLoading: false,
          error: ''
        }
      };

      const statusLoading = getIsIngredientsLoading(state);
      expect(statusLoading).toBe(false);
    });

    test('получение сообщения ошибки через селектор', () => {
      const msgError = 'Привет ошибка';
      const state = {
        ...store.getState(),
        ingredients: {
          ...initialState,
          ingredients: ingredientsMock,
          isIngredientsLoading: true,
          error: msgError
        }
      };

      const errorState = getIngredientsError(state);
      expect(errorState).toBe(msgError);
    });
  });
});
