import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Overlay, ButtonRow } from '../../all';
import { AdditionalItem as Item } from './add';

export function Additional(){
  const { t } = useTranslation();
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(false);

  const items = [
    { title: t('add_menu.cashier1'), sub_title: t('add_menu.cashier2'), checked: checked['cashier'], label: 'cashier' },
    { title: t('add_menu.time1'), sub_title: t('add_menu.time2'), checked: checked['time'], label: 'time' },
    { title: t('add_menu.order1'), sub_title: t('add_menu.order2'), checked: checked['order'], label: 'order' },
    { title: t('add_menu.kitchen1'), sub_title: t('add_menu.kitchen2'), checked: checked['kitchen'], label: 'kitchen' },
    { title: t('add_menu.user1'), sub_title: t('add_menu.user2'), checked: checked['user'], label: 'user' },
    { title: t('add_menu.meal1'), sub_title: t('add_menu.meal2'), checked: checked['meal'], label: 'casmealhier' },
    { title: t('add_menu.balance1'), sub_title: t('add_menu.balance2'), checked: checked['balance'], label: 'balance' },
    { title: t('add_menu.info1'), sub_title: t('add_menu.info2'), checked: checked['info'], label: 'info' },
    { title: t('add_menu.barcode1'), sub_title: t('add_menu.barcode2'), checked: checked['barcode'], label: 'barcode' },
  ];

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, more: t('page.more'), onCheck };
    return (<Item {...itemProps} />);
  }

  const onCheck = (label, value) => {
    setChecked({...checked, ...{[label]: value}});
  }

  const onClickCancel = () => {
    setChecked({});
  }

  const onClickSave = () => {
    // setLoading(true);
    console.log(checked);
    setTimeout(() => setLoading(false), 1200);
  }

  const btnProps = { onClickCancel, onClickSave };

  return (
    <Overlay className='c_tab_cont' loading={loading}>
      <p className='c_tab_title'>{t('system_menu.additional')}</p>
      <div className='c_tab_back'>
        {items?.map(renderItem)}
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}