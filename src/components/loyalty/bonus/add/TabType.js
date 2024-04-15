import React from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import { Input, MoneyInput } from '../../../all';
import { TabTypeItems } from './TabTypeItems';
import { TabTypeCategory } from './TabTypeCategory';

export function TabType(props){
  const { page, type, setType, setBonusItems, setError, setError1 } = props;
  const { t } = useTranslation();

  const onChange = (checked, value) => {
    setType({ value: checked ? null : value, everyAmount: '', bonusPoint: '', purchaseMinAmount: '', purchaseCount: '', categoryId: null });
    setBonusItems([]);
    setError(null);
    setError1(null);
  }

  const onChangePrice = (value, field) => setType({...type, [field]: value?.value });

  const onChangeNumber = (value, field) => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(!isNaN(text)) setType({...type, [field]: text });
  } 

  return page === 1 && (
    <div>
      <Type title={t('bonus.title0')} label={t('bonus.label0')} value={0} onChange={onChange} data={type}>
        <MoneyInput
          label={t('bonus.every_amount')}
          placeholder={t('bonus.every_amount')}
          value={{ value: type?.everyAmount }}
          setValue={value => onChangePrice(value, 'everyAmount')}
          setError={setError1}
          inRow={true} />
        <Input
          label={t('bonus.bonus_point')}
          placeholder={t('bonus.bonus_point')}
          setError={setError1}
          value={{ value: type?.bonusPoint }}
          setValue={value => onChangeNumber(value, 'bonusPoint')} />
      </Type>
      <Type title={t('bonus.title1')} label={t('bonus.label1')} value={1} onChange={onChange} data={type}>
        <Input
          label={t('bonus.purchase_count')}
          placeholder={t('bonus.purchase_count')}
          value={{ value: type?.purchaseCount }}
          setError={setError1}
          setValue={value => onChangeNumber(value, 'purchaseCount')}
          inRow={true}  />
        <MoneyInput
          label={t('bonus.purchase_min_amount')}
          placeholder={t('bonus.purchase_min_amount1')}
          setError={setError1}
          value={{ value: type?.purchaseMinAmount }}
          setValue={value => onChangePrice(value, 'purchaseMinAmount')} />
        <Input
          label={t('bonus.bonus_point')}
          placeholder={t('bonus.bonus_point')}
          setError={setError1}
          value={{ value: type?.bonusPoint }}
          setValue={value => onChangeNumber(value, 'bonusPoint')} />
      </Type>
      <Type title={t('bonus.title2')} label={t('bonus.label2')} value={2} onChange={onChange} data={type}>
        <TabTypeItems {...props} setError={setError1} />
      </Type>
      <Type title={t('bonus.title3')} label={t('bonus.label3')} value={3} onChange={onChange} data={type}>
        <TabTypeCategory {...props} onChangeNumber={onChangeNumber} setError1={setError1} />
      </Type>
    </div>
  );
}

export function Type(props){
  const { title, label, value, data, children, onChange } = props;
  const checked = data?.value === value;

  return (
    <div>
      <div className='bt_header'>
        <div className='bt_header1'>
          <p className='bt_header_title'>{title}</p>
          <p className='bt_header_descr'>{label}</p>
        </div>
        <Switch className='a_item_check' checked={checked} onChange={() => onChange(checked, value)} />
      </div>
      {checked && children}
    </div>
  );
}