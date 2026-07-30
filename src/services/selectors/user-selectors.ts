import type { RootState } from '../store';

// user
export const getAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const userDataSelector = (state: RootState) => state.user.data;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;

export const getErrorMessage = (state: RootState) => state.user.errorMessage;
export const getErrorUpdateUser = (state: RootState) =>
  state.user.updateUserError;
