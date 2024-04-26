import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { createBrowserHistory } from "history";

import { setIsLoggedIn } from './services';
import { Header, Menu } from './components/menu';
import { Loading, Login, SignUp, Confirm, Home, Recovery } from './pages';
import { Review } from './pages/report/Review';

export function App(){
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector(state => state.login);
  const loggedIn = useSelector(state => state.temp.loggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!window.sessionStorage.length){
      window.localStorage.setItem('getSessionStorage', Date.now());
    } else {
      dispatch(setIsLoggedIn(true));
    }
    window.addEventListener('storage', function(event){
      if(event.key === 'getSessionStorage') {
        window.localStorage.setItem('sessionStorage', Date.now());
        window.localStorage.removeItem('sessionStorage');
      } else if(event.key === 'sessionStorage' && !window.sessionStorage.length){
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        dispatch(setIsLoggedIn(true));
      } else if(event.key === 'CREDENTIALS_FLUSH'){
        dispatch(setIsLoggedIn(false));
        window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!loggedIn || !user) return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/sign_up' element={<SignUp />} />
          <Route path='/confirm' element={<Confirm />} />
          <Route path='/recovery' element={<Recovery />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );

  const menuProps = { collapsed, setCollapsed };
  
  return (
    <HistoryRouter history={createBrowserHistory()}>
      <Suspense fallback={<Loading />}>
        <Layout style={{minHeight: '100vh'}}>
          <Header {...menuProps} />
          <SizeMe>{({ size }) => 
          <Layout>
            <Menu {...menuProps} size={size} />
            {/* <Chat/> */}
            <Layout>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='*' element={<Review />} />
                <Route path='/confirm' element={<Confirm />} />
                <Route path='/report/report_buyer' element={<Review />} />
              </Routes>
            </Layout>
          </Layout>
          }</SizeMe>
        </Layout>
      </Suspense>
    </HistoryRouter>
  )
}