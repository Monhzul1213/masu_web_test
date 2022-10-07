import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false
};

export const tempSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
  }
});

export const { setIsLoggedIn } = tempSlice.actions;

export const tempReducer = tempSlice.reducer;