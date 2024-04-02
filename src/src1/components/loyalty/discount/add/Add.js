import React from 'react';
import { useTranslation } from 'react-i18next';

import { AddItem } from './AddItem';
import { Input,  Radio, MoneyInput, PercentInput } from '../../../all/all_m';
import { Date } from '../../../../../components/all';

export function Add(props){
  const { name, setName, setError,setIsEach, setEdited, isEach, perc, setPerc, selected,
          price, setPrice, isCheck, setIsCheck, isDis, setIsDis, beginDate, setBeginDate, endDate, setEndDate } = props;
  const { t } = useTranslation();

  const onChangeDis = value => {
    setIsDis(value)
    if(value?.value === '1') setIsEach({value: '0'})
  }

  const nameProps = { value: name, setValue: setName, label: t('discount.name'), placeholder: t('discount.name'), setError, inRow: true, setEdited, length: 20 };
  const valueProps = { value: price, setValue: setPrice, label: t('discount.amount'), placeholder: t('discount.amount'), setError, setEdited, className: 'dis_back'};
  const percProps = { value: perc, setValue: setPerc, label: t('discount.perc'), placeholder: t('discount.perc'), setError, setEdited, className: 'dis_back' };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('discount.type'), data: t('discount.types'), setEdited, setError, disabled: isDis?.value === '1' ? true : false  };
  const checkProps = { value: isCheck, setValue: setIsCheck, label: t('discount.title1'), label1: t('discount.title2'),  setEdited, setError };
  const disProps = { value: isDis, setValue: onChangeDis, data: t('discount.discount'), setEdited, setError, disabled : selected ? true : false };
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true };
  
  return (
    <div className='ac_back_dz' id='mo_ac_back_dz'>
        <Input {...nameProps} />
        <Radio {...disProps}/> 
        <div className='row'>
          <Radio {...unitProps}/> 
          <div className='gap'/>
          {(isEach.value === '0') ? <PercentInput {...percProps}/> :  <MoneyInput {...valueProps}/>}
        </div> 
        <div className='ac_row' style={{marginTop: 20}}>
          <Date {...date1Props} />
          <div className='gap' />
          <Date {...date2Props} />
        </div>
        <div className='c_tab_back1'>
              <AddItem {...checkProps}/>
        </div>
    </div>
  )
}
