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
      state.categoryColors = action.payload;
    },
  }
});

export const getConstants = (user, token, type, setFunction) => async dispatch => {
  try {
    /*
    const response = await fetchRetry(loginConfig?.url + 'System/GetConstants?ConstType=' + type, token);
    console.log('----------', response);
    if(response?.error_code === 401){
      return dispatch(apiLogin(user?.mail, user?.password)).then(async response1 => {
        console.log('===========', response1);
        if(response1?.error)
          return response1;
        else {
          console.log(url, response1?.token ?? token);
          const response2 = await fetchRetry(url + 'GetConstants?ConstType=' + type, response1?.token ?? token);
          console.log('++++++++++++', response2);
          if(response2?.error_code && response2?.error_code !== 200){
            return Promise.resolve({ error: response2?.description, error_code: response2?.error_code });
          } else {
            setFunction && dispatch(setFunction(response2?.data));
            return Promise.resolve({ error: null, data: response2?.data });
          }
        }
      });
    } else if(response?.error_code && response?.error_code !== 200){
      return Promise.resolve({ error: response?.description, error_code: response?.error_code });
    } else  {
      setFunction && dispatch(setFunction(response?.data));
      return Promise.resolve({ error: null, data: response?.data });
    }
    */
  } catch (err) {
    return Promise.resolve({ error: err?.toString() });
  }
};

function fetchRetry(url, token, retries = 5) {
  const headers = { 'Authorization': 'Bearer ' + token };
  return axios.get(url, { headers })
    .then(res => {
      return res?.data;
    }).catch(error => {
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetry(url, token, retries - 1)
      } else {
        return Promise.resolve({ description: error?.message, error_code: 100 });
      }
    });
}

export const { setIsLoggedIn, setCategoryColors } = tempSlice.actions;

export const tempReducer = tempSlice.reducer;