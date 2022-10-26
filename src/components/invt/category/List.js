import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckAll, ButtonRowAdd } from '../../all';
import { Item } from './Item';

export function List(props){
  const { onClickAdd, data } = props;
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const onClickDelete = () => {};
  
  const onCheckAll = checked => {
    setShow(checked);
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item };
    return (<Item {...itemProps} />)
  }

  const addProps = { type: 'category', onClickAdd, show, onClickDelete };
  const checkProps = { type: 'category', onCheckAll };

  return (
    <div className='card_container'>
      <ButtonRowAdd {...addProps} />
      <div style={{height: 20}} />
      <CheckAll {...checkProps} />
      <div className='list_back'>
        {data?.map(renderItem)}
      </div>
    </div>
  )
}