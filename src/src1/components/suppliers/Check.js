import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '../all/all_m';

export function Check(props){
  const { label, value, setValue, disabled, handleCheck, loading } = props;
  const { t } = useTranslation();


  return ! disabled && (
    <div>
      <div className='sp_check_row'>
        <Input
          value={value}
          setValue={setValue}
          handleEnter={handleCheck}
          inRow={true}
          disabled={disabled}
          label={t('supplier.' + label + '_code')}
          placeholder={t('supplier.' + label + '_code')} />
        <div className='im_gap' />
        <Button
          id='sp_check_btn'
          className='co_check_btn'
          text={t('tax.check')}
          onClick={handleCheck}
          disabled={disabled}
          loading={loading} />
      </div>
      <Input
        value={{ value: value?.name ?? '', error: value?.error1 }}
        disabled={true}
        label={t('supplier.' + label + '_name')}
        placeholder={t('supplier.' + label + '_name')} />
    </div>
  );
}