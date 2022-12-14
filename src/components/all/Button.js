import React, { useState } from 'react';

import { Confirm } from './Confirm';

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

export function ButtonConfirm(props){
  const { loading, type, className, id, text, disabled, onClick, confirmText } = props;
  const [open, setOpen] = useState(false);

  const confirm = sure => {
    setOpen(false);
    if(sure) onClick();
  }

  const onOpen = () => setOpen(true);

  return (
    <>
    <Confirm open={open} text={confirmText} confirm={confirm} />
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onOpen}>
      {loading ? <Loader className='l_loader' color='#fff' /> : text}
    </button>
    </>
  );
}