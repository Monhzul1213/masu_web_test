import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckAll, ButtonRowAdd } from '../../all';

export function List(props){
  const { onClickAdd } = props;
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const onClickDelete = () => {};

  const addProps = { type: 'category', onClickAdd, show, onClickDelete };

  return (
    <div className='card_container'>
      <ButtonRowAdd {...addProps} />
      <CheckAll />
    </div>
  )
}