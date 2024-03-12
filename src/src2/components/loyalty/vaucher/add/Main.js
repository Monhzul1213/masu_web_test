import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Date, Select } from '../../../../../components/all';
import { Input, MoneyInput } from '../../../../../src1/components/all/all_m';

export function Main(props){
  const { setError, setEdited, name, setName, price, setPrice, beginDate, setBeginDate, endDate, setEndDate,
          status, setStatus, number, setNumber, controlDisable } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 1, label: 'Идэвхитэй' }]);

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeDate1 = value => {
    setBeginDate(value);
  }

  const onChangeDate2 = value => {
    setEndDate(value);
  }

  const onChangeStatus = value => {
    setStatus(value);
  }

  const onFocusStatus = async () => {
    if(!states?.length || states?.length === 1){
      setStates([
        { value: 1, label: 'Идэвхтэй' },
        { value: 0, label: 'Идэвхгүй' },
      ]);
    }
  }

  const changeNumber = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setNumber({...value, error: 'must_number'});
    else setNumber({ value: text });
  } 
  

  const amtProps = { value: price, setValue: setPrice, label: t('voucher.voucherAmt'), placeholder: t('voucher.voucherAmt'), setError, setEdited, disabled: controlDisable };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, length: 100, inRow: true, disabled: controlDisable };
  const date1Props = { value: beginDate, setValue: onChangeDate1, label: t('voucher.beginDate'), inRow: true  };
  const date2Props = { value: endDate, setValue: onChangeDate2, label: t('voucher.endDate'), inRow: true };
  const statProps = { value: status, setValue: onChangeStatus, data: states, s_value: 'value', s_descr: 'label', label: t('order.status'), onFocus: onFocusStatus };
  const numberProps = { value: number, setValue: changeNumber, label: t('voucher.voucherQty'), placeholder: t('voucher.voucherQty'), setEdited, setError, length: 30 };


  return (
    <div className='cou_add_back'>
      <Input {...nameProps}/>
      {/* <Select {...typeProps}/> */}
      <Input {...numberProps}/>
        {<MoneyInput {...amtProps}/>}
      {/* {(type?.value === 0) ? <ValidateInput {...percProps}/> :  <MoneyInput {...amtProps}/>} */}
      <div className='ac_row' style={{marginTop: 20}}>
        <Date {...date1Props} />
        <div className='gap' />
        <Date {...date2Props} />
      </div>
      <Select {...statProps}/>
    </div>
  );
}