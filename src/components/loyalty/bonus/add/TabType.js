import React from 'react';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import { Input, MoneyInput } from '../../../all';
import { TabTypeItems } from './TabTypeItems';
import { TabTypeCategory } from './TabTypeCategory';

export function TabType(props){
  const { page, type, setType } = props;
  const { t } = useTranslation();

  const onChangePrice = (value, field) => setType({...type, [field]: value?.value });

  const onChangeNumber = (value, field) => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(!isNaN(text)) setType({...type, [field]: text });
  } 

  return page === 1 && (
    <div>
      <Type title={t('bonus.title0')} label={t('bonus.label0')} value={0} {...props}>
        <MoneyInput
          label={t('bonus.every_amount')}
          placeholder={t('bonus.every_amount')}
          value={{ value: type?.everyAmount }}
          setValue={value => onChangePrice(value, 'everyAmount')}
          inRow={true} />
        <Input
          label={t('bonus.bonus_point')}
          placeholder={t('bonus.bonus_point')}
          value={{ value: type?.bonusPoint }}
          setValue={value => onChangeNumber(value, 'bonusPoint')} />
      </Type>
      <Type title={t('bonus.title1')} label={t('bonus.label1')} value={1} {...props}>
        <Input
          label={t('bonus.purchase_count')}
          placeholder={t('bonus.purchase_count')}
          value={{ value: type?.purchaseCount }}
          setValue={value => onChangeNumber(value, 'purchaseCount')}
          inRow={true}  />
        <MoneyInput
          label={t('bonus.purchase_min_amount')}
          placeholder={t('bonus.purchase_min_amount1')}
          value={{ value: type?.purchaseMinAmount }}
          setValue={value => onChangePrice(value, 'purchaseMinAmount')} />
        <Input
          label={t('bonus.bonus_point')}
          placeholder={t('bonus.bonus_point')}
          value={{ value: type?.bonusPoint }}
          setValue={value => onChangeNumber(value, 'bonusPoint')} />
      </Type>
      <Type title={t('bonus.title2')} label={t('bonus.label2')} value={2} {...props}>
        <TabTypeItems {...props} />
      </Type>
      <Type title={t('bonus.title3')} label={t('bonus.label3')} value={3} {...props}>
        <TabTypeCategory {...props} onChangeNumber={onChangeNumber} />
      </Type>
    </div>
  );
}

function Type(props){
  const { title, label, value, type, setType, children, setBonusItems } = props;
  const checked = type?.value === value;

  const onChange = () => {
    setType({ value: checked ? null : value, everyAmount: '', bonusPoint: '', purchaseMinAmount: '', purchaseCount: '', categoryId: null });
    setBonusItems([]);
  }

  return (
    <div>
      <div className='bt_header'>
        <div className='bt_header1'>
          <p className='bt_header_title'>{title}</p>
          <p className='bt_header_descr'>{label}</p>
        </div>
        <Switch className='a_item_check' checked={checked} onChange={onChange} />
      </div>
      {checked && children}
    </div>
  );
}