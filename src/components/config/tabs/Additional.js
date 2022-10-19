import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdditionalItem as Item } from './AdditionalItem';
import { ButtonRow } from './ButtonRow';

export function Additional(){
  const { t } = useTranslation();
  const [checked, setChecked] = useState({});

  const items = [
    { title: t('add_menu.cashier1'), sub_title: t('add_menu.cashier2'), checked: checked['cashier'] },
    { title: t('add_menu.time1'), sub_title: t('add_menu.time2'), checked: checked['time'] },
    { title: t('add_menu.order1'), sub_title: t('add_menu.order2'), checked: checked['order'] },
    { title: t('add_menu.kitchen1'), sub_title: t('add_menu.kitchen2'), checked: checked['kitchen'] },
    { title: t('add_menu.user1'), sub_title: t('add_menu.user2'), checked: checked['user'] },
    { title: t('add_menu.meal1'), sub_title: t('add_menu.meal2'), checked: checked['meal'] },
    { title: t('add_menu.balance1'), sub_title: t('add_menu.balance2'), checked: checked['balance'] },
    { title: t('add_menu.info1'), sub_title: t('add_menu.info2'), checked: checked['info'] },
    { title: t('add_menu.barcode1'), sub_title: t('add_menu.barcode2'), checked: checked['barcode'] },
  ];

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, more: t('page.more'), setChecked };
    return (<Item {...itemProps} />);
  }

  return (
    <div className='c_tab_cont'>
      <p className='c_tab_title'>{t('system_menu.additional')}</p>
      <div className='c_tab_back'>
        {items?.map(renderItem)}
      </div>
      <ButtonRow />
    </div>
  );
}