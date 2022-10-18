import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { config as loginConfig } from '../helpers';

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
    const config = {
      method: 'POST',
      url: loginConfig?.url + 'Merchant/login',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, 
      data: { mail, password }
    };
    const response = await fetchRetryLogin(config);
    console.log('++++++++++++++++++++++=', response);
    if(!response || response?.result){
      return Promise.resolve({ error: response?.message ?? 'Алдаа гарлаа.' });
    } else {
      dispatch(setToken(response?.token));
      dispatch(setUser({ mail, password }));
      return Promise.resolve({ error: null, token: response?.token });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

function fetchRetryLogin(config, retries = 5) {
  return axios(config)
    .then(res => {
      return res?.data;
    }).catch(error => {
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetryLogin(config, retries - 1)
      }
    });
}

export const { setToken, setUser, logout, setLogin } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;