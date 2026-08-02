import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export const nanoidObj = {
  nanoid
};

export interface IBurgerState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: IBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients = [
            ...state.constructorItems.ingredients,
            action.payload
          ];
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoidObj.nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    resetConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveUpIngredient: (state, action: PayloadAction<string>) => {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index === 0) {
        return;
      }
      [ingredients[index - 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index - 1]
      ];
    },
    moveDownIngredient: (state, action: PayloadAction<string>) => {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index === ingredients.length - 1) {
        return;
      }
      [ingredients[index + 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index + 1]
      ];
    }
  }
});

export const {
  addIngredient,
  resetConstructor,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient
} = burgerConstructorSlice.actions;
