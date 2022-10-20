import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TypeItem, TypeItem2, BankModal } from './types';

export function Type(){
  const { t } = useTranslation();
  const [visible, setVisible] = useState(null);

  const onClick2 = (e, type) => {
    e?.preventDefault();
    setVisible(type);
  }

  const items = [
    { title: t('type.emp1'), sub_title: t('type.emp2'), day: 14, icon: 'TbUser' },
    { title: t('type.invt1'), sub_title: t('type.invt2'), day: 14, icon: 'TbBuildingWarehouse' },
    { title: t('type.system1'), sub_title: t('type.system2'), day: 14, icon: 'TbPuzzle' },
  ];

  const items2 = [
    { title: t('type.bank1'), sub_title: t('type.bank3'), btn: t('type.bank2'), icon: 'TbCreditCard', type: 'bank' },
    { title: t('type.account1'), sub_title: t('type.account3'), btn: t('type.account2'), icon: 'TbWallet', type: 'account' },
    { title: t('type.loan1'), sub_title: t('type.loan3'), btn: t('type.loan2'), icon: 'TbCurrencyTugrik', type: 'loan' },
  ];

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, subscribe: t('type.subscribe'), free: t('type.free') };
    return (<TypeItem {...itemProps} />);
  }

  const renderItem2 = (item, index) => {
    const itemProps = { key: index, item, onClick: onClick2 };
    return (<TypeItem2 {...itemProps} />);
  }

  const bankProps = { visible: visible === 'bank' };

  return (
    <div className='c_tab_cont' id='t_tab_cont'>
      {visible === 'bank' && <BankModal {...bankProps} />}
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