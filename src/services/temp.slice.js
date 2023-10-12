import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { config as loginConfig } from '../helpers';
import { apiLogin, partnerLogin } from './login.slice';

const initialState = {
  loggedIn: false,
  categoryColors: [],
  systemTypes: [],
  categoryClass: [],
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
    setSystemTypes: (state, action) => {
      state.systemTypes = action.payload?.sort((a, b) => a.valueNum - b.valueNum);
    },
    setCategoryClass: (state, action) => {
      state.categoryClass = action.payload?.sort((a, b) => a.valueNum - b.valueNum);
    },
  }
});

export const sendRequest = (user, token, api, data, contentType) => async dispatch => {
  try {
    const config = {
      method: 'POST', url: loginConfig?.url + api,
      headers: { 'authorization': token, 'Accept': '*/*', 'Content-Type': contentType ?? 'application/json' },
      data
    }
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'POST', url: loginConfig?.url + api,
          headers: {
            'authorization': responseLogin?.token ?? token, 'Accept': '*/*',
            'Content-Type': contentType ?? 'application/json' },
          data
        }
        const responseNew = await fetchRetry(configNew);
        if(responseNew?.rettype === 0){
          return Promise.resolve({ error: null, data: responseNew?.retdata });
        } else
          return Promise.resolve({ error: responseNew?.retdesc ?? responseNew?.message ?? 'Алдаа гарлаа.', code: responseNew?.rettype, data: responseNew?.retdata });
      }
    } else if(response?.rettype === 0){
      return Promise.resolve({ error: null, data: response?.retdata });
    }
    return Promise.resolve({ error: response?.retdesc ?? response?.message ?? 'Алдаа гарлаа.', code: response?.rettype, data: response?.retdata });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
}

export const deleteRequest = (user, token, api, data) => async dispatch => {
  try {
    let config = {
      method: 'DELETE', url: loginConfig?.url + api,
      headers: { 'authorization': token, 'Accept': '*/*' },
    }
    if(data) config.data = data;
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        let configNew = {
          method: 'DELETE', url: loginConfig?.url + api,
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' },
        }
        if(data) configNew.data = data;
        const responseNew = await fetchRetry(configNew);
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

export const deleteMultiRequest = (user, token, api, data) => async dispatch => {
  try {
    const config = {
      method: 'DELETE', url: loginConfig?.url + api,
      headers: { 'authorization': token, 'Accept': '*/*' },
      data
    }
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'DELETE', url: loginConfig?.url + api,
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' },
          data
        }
        const responseNew = await fetchRetry(configNew);
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
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url + 'System/GetConstants',
          headers: { 'authorization': responseLogin?.token ?? token, 'Accept': '*/*', 'ConstType': type }
        };
        const responseNew = await fetchRetry(configNew);
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

export const getList = (user, token, api, setFunction, headers) => async dispatch => {
  try {
    const config = {
      method: 'GET', url: loginConfig?.url + api,
      headers: {...{ 'authorization': token, 'Accept': '*/*' }, ...headers}
    };
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url + api,
          headers: {...{ 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' }, ...headers}
        };
        const responseNew = await fetchRetry(configNew);
        if(responseNew?.rettype === 0){
          setFunction && dispatch(setFunction(responseNew?.retdata));
          return Promise.resolve({ error: null, data: responseNew?.retdata });
        } else
          return Promise.resolve({ error: responseNew?.retdesc ?? responseNew?.message ?? 'Алдаа гарлаа.', code: responseNew?.rettype, data: responseNew?.retdata });
      }
    } else if(response?.rettype === 0){
      setFunction && dispatch(setFunction(response?.retdata));
      return Promise.resolve({ error: null, data: response?.retdata });
    }
    return Promise.resolve({ error: response?.retdesc ?? response?.message ?? 'Алдаа гарлаа.', code: response?.rettype, data: response?.retdata });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

export const getService = (api, method) => async dispatch => {
  try {
    const config = {
      method: method ?? 'POST', url: loginConfig?.url + api,
      headers: {'Accept': '*/*' }
    };
    const response = await fetchRetry(config);
    const error = response?.rettype === 0 ? null : response?.retdesc;
    return Promise.resolve({ error, data: response });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};
export const getOTC = (user, token, api, setFunction, headers) => async dispatch => {
  try {
    const config = {
      method: 'GET', url: loginConfig?.url1 + api,
      headers: {...{ 'authorization': token, 'Accept': '*/*' }, ...headers}
    };
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(apiLogin(user?.mail, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url1 + api,
          headers: {...{ 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' }, ...headers}
        };
        const responseNew = await fetchRetry(configNew);
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


export const getPartnerList = (user, token, api, setFunction, headers) => async dispatch => {
  try {
    const config = {
      method: 'GET', url: loginConfig?.url + api,
      headers: {...{ 'authorization': token, 'Accept': '*/*' }, ...headers}
    };
    const response = await fetchRetry(config);
    if(response?.result === 2){
      const responseLogin = await dispatch(partnerLogin(user?.partnerCode, user?.password));
      if(responseLogin?.error) return responseLogin;
      else {
        const configNew = {
          method: 'GET', url: loginConfig?.url + api,
          headers: {...{ 'authorization': responseLogin?.token ?? token, 'Accept': '*/*' }, ...headers}
        };
        const responseNew = await fetchRetry(configNew);
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

export const getServiceOTC = (api, method) => async dispatch => {
  try {
    const config = {
      method: method ?? 'GET', url: loginConfig?.otc + api,
      headers: {'Accept': '*/*' }
    };
    const response = await fetchRetry(config);
    const error = response?.rettype === 0 ? null : response?.retdesc;
    return Promise.resolve({ error, data: response });
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
      else return { result: 444, rettype: 444, message: error?.message, retdesc: error?.message };
    });
}

export const { setIsLoggedIn, setCategoryColors, setSystemTypes, setCategoryClass } = tempSlice.actions;

export const tempReducer = tempSlice.reducer;