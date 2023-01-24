import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { config as loginConfig } from '../helpers';

const initialState = {
  token: '',
  user: null,
  webUser: null,
  toRemember: false,
  isOwner: false,
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
      state.webUser = action.payload;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isOwner = false;
    },
    setLogin: (state, action) => {
      state.toRemember = action.payload?.toRemember;
    },
  }
});

export const apiRegister = data => async dispatch => {
  try {
    const config = {
      method: 'POST',
      url: loginConfig?.url + 'Merchant/register',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, 
      data
    };
    const response = await fetchRetryLogin(config);
    if(!response || response?.rettype || response?.rettype === undefined){
      return Promise.resolve({ error: response?.retdesc ?? (response?.rettype === undefined ? response?.toString() : 'Алдаа гарлаа.') });
    } else {
      return Promise.resolve({ error: null });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
}

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
      let isOwner = mail?.trim()?.toLowerCase() === response?.msMerchant?.email?.trim()?.toLowerCase();
      dispatch(setIsOwner(isOwner));
      dispatch(setToken(response?.token));
      dispatch(setUser({ mail, password, merchantId: response?.merchantId, msRole: response?.msRole, msMerchant: response?.msMerchant }));
      return Promise.resolve({ error: null, token: response?.token, viewReport: response?.msRole?.webViewSalesReport === 'Y' });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

export const apiValidate = mail => async dispatch => {
  try {
    const config = {
      method: 'GET',
      url: loginConfig?.url + 'Merchant/validate/' + mail,
      headers: { 'Accept': '*/*' }, 
    };
    const response = await fetchRetryLogin(config);
    console.log('++++++++++++++++++++++=', response);
    return Promise.resolve({ response });
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
      else return { result: 444, rettype: 444, message: error?.message, retdesc: error?.message };
    });
}

export const { setToken, setUser, logout, setLogin, setIsOwner } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;