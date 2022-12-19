import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { BankModal, Item1, Item2 } from '../../components/config/type';

function Card(props){
  const { size } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(null);

  const id = size?.width >= 500 ? 'co_t_large' : 'co_t_small';

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

  const onClick2 = (e, type) => {
    e?.preventDefault();
    setVisible(type);
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, subscribe: t('type.subscribe'), free: t('type.free') };
    return (<Item1 {...itemProps} />);
  }

  const renderItem2 = (item, index) => {
    const itemProps = { key: index, item, onClick: onClick2 };
    return (<Item2 {...itemProps} />);
  }

  const closeModal = () => setVisible(null);
  const bankProps = { visible: visible === 'bank', closeModal };

  return (
    <div className='co_tab' id='t_tab_cont'>
      {visible === 'bank' && <BankModal {...bankProps} />}
      <div className='t_tab_back' id={id}>
        <p className='c_tab_title' id='t_title'>{t('type.order')}</p>
        {items?.map(renderItem)}
        <div className='t_line' />
        <p className='c_tab_title' id='t_title1'>{t('type.payment')}</p>
        {items2?.map(renderItem2)}
      </div>
    </div>
  )
}

const withSizeHOC = withSize();
export const Type = withSizeHOC(Card);