import type { RootState } from '../store';

export const getStateBurgerConstructor = (state: RootState) =>
  state.burgerConstructor.constructorItems;
