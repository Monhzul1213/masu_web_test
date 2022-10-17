import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { config } from '../helpers';

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

export const apiLogin = (mail, password) => async dispatch => {
  try {
    const response = await fetchRetry(config?.url + 'Customers/login', { mail, password });
    console.log('++++++++++++++++++++++=', response);
    if(!response || response?.error_code){
      return Promise.resolve({ error: response?.description ?? 'Алдаа гарлаа.' });
    } else {
      dispatch(setToken(response?.token));
      dispatch(setUser({ mail, password }));
      return Promise.resolve({ error: null, token: response?.access_token });
    }
  } catch (err) {
    return Promise.resolve({ error: err?.toString() });
  }
};

function fetchRetry(url, data, retries = 5){
  return axios.post(url, data, {})
    .then(res => {
      return res?.data;
    }).catch(error => {
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetry(url, data, retries - 1)
      }
    });
}

export const { setToken, setUser, logout, setLogin } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;