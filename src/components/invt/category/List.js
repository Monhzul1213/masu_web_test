import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckAll, ButtonRowAdd } from '../../all';
import { Item } from './Item';

export function List(props){
  const { onClickAdd, data } = props;
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState({});

  const onClickDelete = () => {
    console.log(selected);
  };
  
  const onCheckAll = checked => {
    setShow(checked);
    setChecked(checked);
    if(checked){
      let selected = {};
      data?.map(item => selected[item?.categoryId] = true);
      setSelected(selected);
    } else
      setSelected({});
  }

  const onCheck = (category, checked) => {
    let newSelected = {...selected};
    if(checked){
      delete newSelected[category];
      setChecked(false);
      if(!(Object.keys(newSelected))?.length) setShow(false);
    } else {
      newSelected[category] = true;
      setShow(true);
    }
    setSelected(newSelected);
  }

  const renderItem = (item, index) => {
    const checked = selected[item?.categoryId] ? true : false;
    const itemProps = { key: index, item, lbl: t('category.item'), checked, onCheck, onClick: onClickAdd };
    return (<Item {...itemProps} />)
  }

  const addProps = { type: 'category', onClickAdd, show, onClickDelete };
  const checkProps = { type: 'category', checked, onCheckAll };

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