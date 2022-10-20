import React from 'react';
import { useTranslation } from 'react-i18next';

import { TypeItem as Item } from './TypeItem';

export function Type(){
  const { t } = useTranslation();

  const items = [
    { title: t('type.emp1'), sub_title: t('type.emp2'), day: 14, icon: 'TbUser' },
    { title: t('type.invt1'), sub_title: t('type.invt2'), day: 14, icon: 'TbBuildingWarehouse' },
    { title: t('type.system1'), sub_title: t('type.system2'), day: 14, icon: 'TbPuzzle' },
  ];

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, subscribe: t('type.subscribe'), free: t('type.free') };
    return (<Item {...itemProps} />);
  }

  return (
    <div className='c_tab_cont'>
      <div className='c_tab_back'>
        <p className='c_tab_title' id='t_title'>{t('type.order')}</p>
        {items?.map(renderItem)}
      </div>
    </div>
  );
}