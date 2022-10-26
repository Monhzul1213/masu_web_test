import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { config as loginConfig } from '../helpers';
import { apiLogin } from './login.slice';

const initialState = {
  loggedIn: false,
  categoryColors: [],
};

export const tempSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
    setCategoryColors: (state, action) => {
      state.categoryColors = action.payload?.sort((a, b) => a.valueNum - b.valueNum);
    },
  }
});

export const sendRequest = (user, token, api, data) => async dispatch => {
  try {
    const config = {
      method: 'POST', url: loginConfig?.url + api,
      headers: { 'authorization': token, 'Accept': '*/*', 'Content-Type': 'application/json' },
      data
    }
    const response = await fetchRetry(config);
    console.log('++++++++++++++++++++++=', response);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'POST', url: loginConfig?.url + api,
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*', 'Content-Type': 'application/json' },
          data
        }
        const responseNew = await fetchRetry(configNew);
        console.log('=====================', responseNew)
        if(responseNew?.rettype === 0){
          return Promise.resolve({ error: null, data: responseNew?.retdata });
        } else
          return Promise.resolve({ error: responseNew?.retdesc ?? responseNew?.message ?? 'Алдаа гарлаа.' });
      }
    } else if(response?.rettype === 0){
      return Promise.resolve({ error: null, data: response?.retdata });
    }
    return Promise.resolve({ error: response?.retdesc ?? response?.message ?? 'Алдаа гарлаа.' });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
}

export const getConstants = (user, token, type, setFunction) => async dispatch => {
  try {
    const config = {
      method: 'GET', url: loginConfig?.url + 'System/GetConstants',
      headers: { 'authorization': token, 'Accept': '*/*', 'ConstType': type }
    };
    const response = await fetchRetry(config);
    console.log('++++++++++++++++++++++=', response);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url + 'System/GetConstants',
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*', 'ConstType': type }
        };
        const responseNew = await fetchRetry(configNew);
        console.log('=====================', responseNew)
        if(responseNew?.rettype === 0){
          setFunction && dispatch(setFunction(responseNew?.retdata));
          return Promise.resolve({ error: null, data: responseNew?.retdata });
        } else
          return Promise.resolve({ error: responseNew?.retdesc ?? responseNew?.message ?? 'Алдаа гарлаа.' });
      }
    } else if(response?.rettype === 0){
      setFunction && dispatch(setFunction(response?.retdata));
      return Promise.resolve({ error: null, data: response?.retdata });
    }
    return Promise.resolve({ error: response?.retdesc ?? response?.message ?? 'Алдаа гарлаа.' });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

export const getList = (user, token, api, setFunction) => async dispatch => {
  try {
    const config = {
      method: 'GET', url: loginConfig?.url + api,
      headers: { 'authorization': token, 'Accept': '*/*' }
    };
    const response = await fetchRetry(config);
    console.log('++++++++++++++++++++++=', response);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url + api,
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' }
        };
        const responseNew = await fetchRetry(configNew);
        console.log('=====================', responseNew)
        if(responseNew?.rettype === 0){
          setFunction && dispatch(setFunction(responseNew?.retdata));
          return Promise.resolve({ error: null, data: responseNew?.retdata });
        } else
          return Promise.resolve({ error: responseNew?.retdesc ?? responseNew?.message ?? 'Алдаа гарлаа.' });
      }
    } else if(response?.rettype === 0){
      setFunction && dispatch(setFunction(response?.retdata));
      return Promise.resolve({ error: null, data: response?.retdata });
    }
    return Promise.resolve({ error: response?.retdesc ?? response?.message ?? 'Алдаа гарлаа.' });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

function fetchRetry(config, retries = 5) {
  return axios(config)
    .then(res => {
      return res?.data;
    }).catch(error => {
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetry(config, retries - 1)
      }
    });
}

export const { setIsLoggedIn, setCategoryColors } = tempSlice.actions;

export const tempReducer = tempSlice.reducer;