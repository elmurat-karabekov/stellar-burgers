import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';
import { deleteTokens, setTokens } from '../../utils/authTokens';

type TUserAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  registerError: string | null;
  loginError: string | null;
  isLoading: boolean;
};

const initialState: TUserAuthState = {
  user: null,
  isAuthChecked: false,
  loginError: null,
  registerError: null,
  isLoading: false
};

export const getUser = createAsyncThunk(
  'user/loadUser',
  async () => await getUserApi()
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser())
        .unwrap()
        .then((data) => dispatch(setUser(data.user)))
        .finally(() => {
          dispatch(setAuthChecked());
        });
    } else {
      dispatch(setAuthChecked());
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);

    const { accessToken, refreshToken, user } = response;

    setTokens({ accessToken, refreshToken });

    return user;
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);

    const { accessToken, refreshToken, user } = response;

    setTokens({ accessToken, refreshToken });

    return user;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await logoutApi();

    deleteTokens();

    dispatch(resetUser());
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TUser>) => {
    const response = await updateUserApi(data);

    return response.user;
  }
);

export const userAuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    isAuthChecked: (state) => state.isAuthChecked,
    registerError: (state) => state.registerError,
    loginError: (state) => state.loginError,
    isAuthLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.error.message ?? null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message ?? null;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setAuthChecked, resetUser, setUser } = userAuthSlice.actions;
export const {
  selectUser,
  isAuthChecked,
  registerError,
  loginError,
  isAuthLoading
} = userAuthSlice.selectors;
