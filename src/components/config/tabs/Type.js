import React from 'react';
import { useTranslation } from 'react-i18next';

import { TypeItem, TypeItem2 } from './types';

export function Type(){
  const { t } = useTranslation();

  const items = [
    { title: t('type.emp1'), sub_title: t('type.emp2'), day: 14, icon: 'TbUser' },
    { title: t('type.invt1'), sub_title: t('type.invt2'), day: 14, icon: 'TbBuildingWarehouse' },
    { title: t('type.system1'), sub_title: t('type.system2'), day: 14, icon: 'TbPuzzle' },
  ];

  const items2 = [
    { title: t('type.bank1'), sub_title: t('type.bank3'), btn: t('type.bank2'), icon: 'TbCreditCard' },
    { title: t('type.account1'), sub_title: t('type.account3'), btn: t('type.account2'), icon: 'TbWallet' },
    { title: t('type.loan1'), sub_title: t('type.loan3'), btn: t('type.loan2'), icon: 'TbCurrencyTugrik' },
  ];

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, subscribe: t('type.subscribe'), free: t('type.free') };
    return (<TypeItem {...itemProps} />);
  }

  const renderItem2 = (item, index) => {
    const itemProps = { key: index, item };
    return (<TypeItem2 {...itemProps} />);
  }

  return (
    <div className='c_tab_cont' id='t_tab_cont'>
      <div className='t_tab_back'>
        <p className='c_tab_title' id='t_title'>{t('type.order')}</p>
        {items?.map(renderItem)}
        <div className='t_line' />
        <p className='c_tab_title' id='t_title1'>{t('type.payment')}</p>
        {items2?.map(renderItem2)}
      </div>
    </div>
  );
}