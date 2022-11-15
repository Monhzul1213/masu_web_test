

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AddItem } from './AddItem';

import {  Input,  Radio, MoneyInput} from '../../../all/all_m';

export function Add(props){
  const { name, setName, setError,setIsEach, setEdited, isEach } = props;
  const { t } = useTranslation();
  const [price, setPrice] = useState({ value: '' });
  const [checked, setChecked] = useState({});
  const [perc, setPerc] = useState({ value: '' });

  useEffect(() => {
    // getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onCheck = (label, value) => {
    setChecked({...checked, ...{[label]: value}});
  }
  const items = [
    { title: t('discount.title1'), sub_title: t('discount.title2'), checked: checked['discount'], label: 'discount' },
  ];

  const renderItem = (item, index) => {
        const itemProps = { key: index, item, more: t('page.more'), onCheck };
        return (<AddItem {...itemProps} />);
      }




  const nameProps = { value: name, setValue: setName, label: t('discount.name'), placeholder: t('discount.name'), setError, inRow: true, setEdited, length: 20 };
  const valueProps = { value: price, setValue: setPrice, label: t('discount.amount'), placeholder: t('discount.amount'), setError,  };
  const percProps = { value: perc, setValue: setPerc, label: t('discount.perc'),placeholder: t('discount.perc'), setError, mask: '99.99' };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('discount.type'), data: t('discount.types'), setEdited, setError };

  return (
    <div className='ac_back' id='mo_ac_back'>
        <Input {...nameProps} />
        <Radio {...unitProps}/>
       {(isEach.value === 'Y') ? <Input {...percProps}/> : 
         <MoneyInput {...valueProps}/>} 
        <div className='c_tab_back1'>
               {items?.map(renderItem)}
            </div>
    </div>
  )
}