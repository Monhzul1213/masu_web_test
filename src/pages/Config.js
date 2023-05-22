import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../css/config.css';
import '../css/invt.css';
import { Card, AppModal } from '../components/config';
import { Additional, Type, Cashier, Tax, Store, Pos, Document, TaxAdd } from './configs';
import { Order } from '../src1/pages/config/Order';

export function Config(props){
  const { size, collapsed } = props;
  const [showMenu, setShowMenu] = useState(true);
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user }  = useSelector(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webEditSettings !== 'Y') navigate({ pathname: '/' });
    else {
      let mode = searchParams?.get('mode');
      if(mode === 'is_first') setVisible(true);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let width = (size?.width ?? 1500) - 30 - (collapsed ? 72 : 300);
    setShowMenu(width >= 1000);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, collapsed]);

  const closeModal = () => {
    setVisible(false);
    searchParams.delete('mode');
    setSearchParams(searchParams);
  }

  const modalProps = { visible, closeModal };

  return (
    <div className='co_back'>
      {visible && <AppModal {...modalProps} />}
      {showMenu && <Card />}
      <Routes>
        <Route path="/" element={<Navigate to="additional" replace />} />
        <Route path="*" element={<Navigate to="additional" replace />} />
        <Route path='additional' element={<Additional />} />
        <Route path='type' element={<Type />} />
        <Route path='cashier' element={<Cashier />} />
        <Route path='tax' element={<Tax />} />
        <Route path='tax/tax_add' element={<TaxAdd />} />
        <Route path='document' element={<Document />} />
        <Route path='pos' element={<Pos />} />
        <Route path='store' element={<Store />} />
        <Route path='location' element={<Order />} />
      </Routes>
    </div>
  )
}