import {
  burgerConstructorSlice,
  addIngredient,
  resetConstructor,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient
} from '../burger-constructor-slice';

import { getStateBurgerConstructor } from '@selectors';

import store from '@store';

import { expect, test, describe, jest, afterEach } from '@jest/globals';
import { nanoidObj } from '../burger-constructor-slice';

import {
  initialconstructorItems,
  ingredientsAfterDeletedOne,
  ingredientsAfteMoveUp,
  ingredientsAfteMoveDown
} from '../../../mocks/constructorItems';

const initialBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const initialIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('тесты слайса burgerConstructorSlice', () => {
  const initialState = burgerConstructorSlice.getInitialState();
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('тесты синхронных экшенов', () => {
    describe('проверка работы добавления', () => {
      test('добавление bun', () => {
        jest
          .spyOn(nanoidObj, 'nanoid')
          .mockImplementation(() => 'test-id-bun-347');

        const initialConstructorState = {
          ...initialState
        };

        const newState = burgerConstructorSlice.reducer(
          initialConstructorState,
          addIngredient(initialBun)
        );

        expect(newState.constructorItems.bun).toEqual({
          ...initialBun,
          id: 'test-id-bun-347'
        });
        expect(newState.constructorItems.ingredients).toEqual([]);
      });

      test('добавление ингредиента', () => {
        jest
          .spyOn(nanoidObj, 'nanoid')
          .mockImplementation(() => 'test-id-ingredient-347');

        const initialConstructorState = {
          ...initialState
        };

        const newState = burgerConstructorSlice.reducer(
          initialConstructorState,
          addIngredient(initialIngredient)
        );

        expect(newState.constructorItems.ingredients).toEqual([
          {
            ...initialIngredient,
            id: 'test-id-ingredient-347'
          }
        ]);
        expect(newState.constructorItems.bun).toBe(null);
      });
    });

    describe('проверка работы очистки состояния', () => {
      test('проверка очистки bun и ingredients', () => {
        const initialConstructorState = {
          ...initialState,
          ...initialconstructorItems
        };

        const newState = burgerConstructorSlice.reducer(
          initialConstructorState,
          resetConstructor()
        );

        expect(newState.constructorItems.ingredients).toEqual([]);
        expect(newState.constructorItems.bun).toBe(null);
      });
    });

    describe('проверка работы удаления', () => {
      test('проверка удаления bun (bun не должен удаляться)', () => {
        const initialConstructorState = {
          ...initialState,
          ...initialconstructorItems
        };

        const newState = burgerConstructorSlice.reducer(
          initialConstructorState,
          removeIngredient('test-id-bun')
        );

        expect(newState.constructorItems.ingredients).toHaveLength(3);
        expect(newState.constructorItems.bun).not.toBe(null);
      });

      test('проверка удаления одного ингредиента', () => {
        const initialConstructorState = {
          ...initialState,
          ...initialconstructorItems
        };

        const newState = burgerConstructorSlice.reducer(
          initialConstructorState,
          removeIngredient('test-id-ingredient-1')
        );

        expect(newState.constructorItems.ingredients).toHaveLength(2);
        expect(newState.constructorItems.ingredients).toEqual(
          ingredientsAfterDeletedOne
        );
        expect(newState.constructorItems.bun).not.toBe(null);
      });
    });

    describe('проверка работы смещения ингредиента', () => {
      test('проверка поднятия одного ингредиента вверх ( и проверка защиты от сдвига первого ингредиента)', () => {
        const initialConstructorState = {
          ...initialState,
          ...initialconstructorItems
        };
        const afterFirstMove = burgerConstructorSlice.reducer(
          initialConstructorState,
          moveUpIngredient('test-id-ingredient-2')
        );
        expect(afterFirstMove.constructorItems.ingredients).toHaveLength(3);
        expect(afterFirstMove.constructorItems.ingredients).toEqual(
          ingredientsAfteMoveUp
        );

        const afterSecondMove = burgerConstructorSlice.reducer(
          afterFirstMove,
          moveUpIngredient('test-id-ingredient-2')
        );

        expect(afterSecondMove.constructorItems.ingredients).toHaveLength(3);
        expect(afterSecondMove.constructorItems.ingredients).toEqual(
          ingredientsAfteMoveUp
        );
      });

      test('проверка смещения одного ингредиента вниз ( и проверка защиты от сдвига последнего ингредиента)', () => {
        const initialConstructorState = {
          ...initialState,
          ...initialconstructorItems
        };
        const afterFirstMove = burgerConstructorSlice.reducer(
          initialConstructorState,
          moveDownIngredient('test-id-ingredient-2')
        );
        expect(afterFirstMove.constructorItems.ingredients).toHaveLength(3);
        expect(afterFirstMove.constructorItems.ingredients).toEqual(
          ingredientsAfteMoveDown
        );

        const afterSecondMove = burgerConstructorSlice.reducer(
          afterFirstMove,
          moveDownIngredient('test-id-ingredient-2')
        );

        expect(afterSecondMove.constructorItems.ingredients).toHaveLength(3);
        expect(afterSecondMove.constructorItems.ingredients).toEqual(
          ingredientsAfteMoveDown
        );
      });
    });

    describe('работы с неизвестными данными', () => {
      test('неизвестный экшен', () => {
        const state = burgerConstructorSlice.getInitialState();
        const possibleState = burgerConstructorSlice.reducer(undefined, {
          type: 'UNKNOWN'
        });
        expect(possibleState).toEqual(state);
      });
    });
  });

  describe('тесты селекторов', () => {
    test('получение конструктора через селектор', () => {
      const state = {
        ...store.getState(),
        burgerConstructor: {
          ...initialState,
          ...initialconstructorItems
        }
      };

      const constructorItems = getStateBurgerConstructor(state);
      expect(constructorItems).toEqual(
        initialconstructorItems.constructorItems
      );
    });
  });
});
