import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserApi, TRegisterData } from '@api';
import { setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
}

const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError =
          typeof action.error.message === 'string'
            ? action.error.message
            : String(action.error) || 'Ошибка авторизации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      });
  }
});
