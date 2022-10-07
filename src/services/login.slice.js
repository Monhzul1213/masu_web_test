import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: null,
  toRemember: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
    },
    setLogin: (state, action) => {
      state.toRemember = action.payload?.toRemember;
    },
  }
});

export const { setToken, setUser, logout, setLogin } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;