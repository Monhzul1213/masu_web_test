import React from 'react';
import { useLocation } from 'react-router-dom';

export function Header(){
  const { pathname } = useLocation();

  //i18n.exists("common.values.active")

  return (
    <div>Header {pathname}</div>
  );
}