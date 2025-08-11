import React from 'react';

import { ButtonRowAddConfirm } from '../../../all/all_m';

export function Header(props){
  const { onClickAdd, onClickDelete, show } = props;


  const addProps = { type: 'system', onClickAdd, show, onClickDelete };

  return (
    <div className='ih_header' style={{marginTop: 10}}>
      <ButtonRowAddConfirm {...addProps} />
    </div>
  );
}