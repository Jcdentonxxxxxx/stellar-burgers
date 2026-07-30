import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  TRegisterData,
  getUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  errorMessage: string | null;
  loginUserRequest: boolean;
  updateUserError: string | null;
}

const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  errorMessage: null,
  loginUserRequest: false,
  updateUserError: null
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ name, email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

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

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    const res = await updateUserApi(user);
    if (!res?.success) {
      return rejectWithValue(res);
    }
    return res.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    const res = await getUserApi();
    if (!res?.success) {
      return rejectWithValue(res);
    }
    return res.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorMessage = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.errorMessage =
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
      })

      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorMessage = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.errorMessage =
          typeof action.error.message === 'string'
            ? action.error.message
            : String(action.error) || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserError = '';
      })
      .addCase(updateUser.rejected, (state) => {
        state.updateUserError = 'Произошла ошибка обновления данных';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export const { authChecked, clearErrorMessage, userLogout } = userSlice.actions;
