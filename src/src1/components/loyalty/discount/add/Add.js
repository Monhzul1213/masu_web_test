import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AddItem } from './AddItem';
import { Input,  Radio, MoneyInput, Percent } from '../../../all/all_m';
import { Date } from '../../../../../components/all';

export function Add(props){
  const { name, setName, setError,setIsEach, setEdited, isEach, perc, setPerc, 
          price, setPrice, isCheck, setIsCheck, isDis, setIsDis, beginDate, setBeginDate, endDate, setEndDate } = props;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nameProps = { value: name, setValue: setName, label: t('discount.name'), placeholder: t('discount.name'), setError, inRow: true, setEdited, length: 20 };
  const valueProps = { value: price, setValue: setPrice, label: t('discount.amount'), placeholder: t('discount.amount'), setError, setEdited, inRow: true,};
  const percProps = { value: perc, setValue: setPerc, label: t('discount.perc'), placeholder: t('discount.perc'), inRow: true, setError, setEdited, className: 'dis_input_back' };
  const unitProps = { value: isEach, setValue: setIsEach, label: t('discount.type'), data: t('discount.types'), setEdited, setError };
  const checkProps = { value: isCheck, setValue: setIsCheck, label: t('discount.title1'), label1: t('discount.title2'),  setEdited, setError };
  const disProps = { value: isDis, setValue: setIsDis, data: t('discount.discount'), setEdited, setError };
  const date1Props = { value: beginDate, setValue: setBeginDate, label: t('coupon.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: setEndDate, label: t('coupon.endDate'), inRow: true };
  
  return (
    <div className='ac_back_dz' id='mo_ac_back_dz'>
        <Input {...nameProps} />
        {/* <Radio {...disProps}/>  */}
        {/* <div className='row'> */}
          <Radio {...unitProps}/> 
          {(isEach.value === '0') ? <Percent {...percProps}/> :  <MoneyInput {...valueProps}/>}
        {/* </div>  */}
        {/* <div className='ac_row' style={{marginTop: 20}}>
          <Date {...date1Props} />
          <div className='gap' />
          <Date {...date2Props} />
        </div> */}
        <div className='c_tab_back1'>
              <AddItem {...checkProps}/>
        </div>
    </div>
  )
}
