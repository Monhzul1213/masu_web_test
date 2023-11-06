import React from 'react';

import { Loader } from '../../all/Loader';


export function IconButton(props){
  const { loading, type, className, id, text, icon, disabled, onClick } = props;

  return (
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onClick}>
      {text}
      {loading ? <Loader className='l_loader' color='#fff' /> : onClick ? icon : ''}
    </button>
  );
}