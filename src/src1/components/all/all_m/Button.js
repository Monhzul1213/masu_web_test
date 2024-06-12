import React from 'react';

import { Loader } from './Loader';

export function Button(props){
  const { loading, type, className, id, text, disabled, onClick } = props;

  return (
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onClick}>
      {loading ? <Loader className='l_loader' color='#fff' /> : text}
    </button>
  );
}

export function IconButton(props){
  const { loading, type, className, id, text, icon, disabled, onClick } = props;

  return (
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onClick}>
      {loading ? <Loader className='l_loader' color='#fff' /> : icon}
      {text}
    </button>
  );
}