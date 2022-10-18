import React from 'react';
import { useDispatch } from 'react-redux';

import { logout, setIsLoggedIn } from '../services';

export function Home(){
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
    dispatch(setIsLoggedIn(false));
    window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
    window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString())
    window.localStorage.removeItem('CREDENTIALS_FLUSH')
  }

  return (
    <div style={{padding:15}}>
      <p>Home</p>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  )
}